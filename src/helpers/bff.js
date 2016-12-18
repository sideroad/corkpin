import { normalize, proxy } from 'koiki';
import cloudinary from 'cloudinary';
import uris from '../uris';
import config from '../config';

const apiBase = normalize(`${config.api.host}:${config.api.port}`);

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.client,
  api_secret: config.cloudinary.secret
});

export default function (app) {
  const headers = {
    'x-chaus-client': config.chaus.client,
    'x-chaus-secret': config.chaus.secret
  };

  proxy({
    app,
    protocol: 'https',
    host: config.api.host,
    prefix: '/bff',
    before: (url, options, cb) => console.log(options) || cb([url, {
      ...options,
      headers: {
        ...options.headers,
        ...headers
      }
    }]),
    customizer: {
      [uris.apis.images]: {
        POST: {
          before: (url, options, cb) => {
            const json = JSON.parse(options.body);
            cloudinary.uploader.upload(json.url, (result) => {
              json.url = result.secure_url;
              cb([url, {
                ...options,
                body: JSON.stringify(json),
                headers: {
                  ...options.headers,
                  ...headers,
                  'content-length': JSON.stringify(json).length
                }
              }]);
            });
          }
        },
        GET: {
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
        }
      },
      [uris.apis.boards]: {
        GET: {
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
    }
  });
}
