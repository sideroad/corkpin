import { normalize, proxy } from 'koiki';
import uris from '../uris';
import config from '../config';

const apiBase = normalize(`${config.api.host}:${config.api.port}`);

export default function (app) {
  const headers = {
    'x-chaus-client': process.env.CHAUS_BOARD_CLIENT_ID,
    'x-chaus-secret': process.env.CHAUS_BOARD_SECRET_ID
  };

  proxy({
    app,
    protocol: 'https',
    host: config.api.host,
    prefix: '/bff',
    before: (url, options) => [url, {
      ...options,
      headers
    }],
    customizer: {
      [uris.apis.images]: {
        override: (req, res) => {
          const values = req.query;
          if (!req.isAuthenticated()) {
            res.status(400).json({});
          } else {
            const user = req.user;
            fetch(`${apiBase}/apis/board/allows?board=${values.board}&user=${user.id}`, {
              headers
            })
              .then(res => res.json())
              .then((_res) => {
                if (!_res.items.length) {
                  res.status(400).json();
                  throw new Error();
                }
                return;
              })
              .then(() => fetch(`${apiBase}/apis/board/images?board=${values.board}`, {
                headers
              }))
              .then(res => res.json())
              .then(_res => res.json(_res))
              .catch(err => console.log(err) || res.json({}));
          }
        }
      },
      [uris.apis.boards]: {
        override: (req, res) => {
          const values = req.query;
          if (!req.isAuthenticated()) {
            res.status(400).json({});
          } else {
            const user = req.user;
            fetch(`${apiBase}/apis/board/allows?user=${user.id}`, {
              headers
            })
              .then(res => res.json())
              .then((res) => {
                const boards = res.items.map(item => item.board.id);
                return boards;
              })
              .then(boards => fetch(`${apiBase}/apis/board/boards?id=${boards.join(',')}&name=*${values.query || ''}*`, {
                headers
              }))
              .then(res => res.json())
              .then((res) => {
                const promises = res.items.map(
                  item =>
                    fetch(`${apiBase}/apis/board/images?board=${item.id}&offset=0&limit=1`, {
                      headers
                    })
                      .then(res => res.json())
                      .then(images => ({
                        ...item,
                        image: images.items[0].url
                      }))
                );
                return Promise.all(promises).then(items => ({
                  items
                }));
              })
              .then(_res => res.json(_res))
              .catch(err => console.log(err) || res.json({}));
          }
        }
      }
    }
  });
}
