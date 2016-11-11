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
        .then(_res => res.json(_res));
    }
  });
}
