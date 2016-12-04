import { normalize } from 'koiki';
import uris from '../uris';
import config from '../config';

const base = normalize(`${config.api.host}:${config.api.port}`);

export default function (app) {
  app.get(uris.apis.images, (req, res) => {
    const values = req.query;
    if (!req.isAuthenticated()) {
      res.status(400).json({});
    } else {
      const user = req.user;
      fetch(`${base}/apis/board/allows?board=${values.board}&user=${user.id}`)
        .then(res => res.json())
        .then((_res) => {
          if (!_res.items.length) {
            res.status(400).json();
            throw new Error();
          }
          return;
        })
        .then(() => fetch(`${base}/apis/board/images?board=${values.board}`))
        .then(res => res.json())
        .then(_res => res.json(_res))
        .catch(err => console.log(err) || res.json({}));
    }
  });

  app.get(uris.apis.boards, (req, res) => {
    const values = req.query;
    if (!req.isAuthenticated()) {
      res.status(400).json({});
    } else {
      const user = req.user;
      fetch(`${base}/apis/board/allows?user=${user.id}`)
        .then(res => res.json())
        .then((res) => {
          const boards = res.items.map(item => item.board.id);
          return boards;
        })
        .then(boards => console.log(`${base}/apis/board/boards?id=${boards.join(',')}&name=*${values.query || ''}*`) || fetch(`${base}/apis/board/boards?id=${boards.join(',')}&name=*${values.query || ''}*`))
        .then(res => res.json())
        .then((res) => {
          const promises = res.items.map(
            item =>
              fetch(`${base}/apis/board/images?board=${item.id}&offset=0&limit=1`)
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
  });
}
