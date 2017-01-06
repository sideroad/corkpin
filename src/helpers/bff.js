import { normalize, proxy } from 'koiki';
import cloudinary from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import isVideo from 'is-video';
import _ from 'lodash';

import uris from '../uris';
import config from '../config';

const upload = multer({ dest: './tmp/' });
const apiBase = normalize(`${config.api.host}:${config.api.port}`);

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.client,
  api_secret: config.cloudinary.secret
});

export default function (app) {
  const headers = {
    host: config.api.host,
    'content-type': 'application/json',
    'x-chaus-client': config.chaus.client,
    'x-chaus-secret': config.chaus.secret
  };

  const confirmAuth = (req, res) =>
    new Promise((resolve, reject) => {
      if (!req.isAuthenticated()) {
        res.status(400).json({
          user: 'Must be login with facebook account'
        });
        reject();
      } else {
        resolve();
      }
    });

  const confirmPermission = (req, res) =>
    new Promise((resolve, reject) => {
      confirmAuth(req, res)
        .then(
          () =>
            fetch(`${apiBase}/apis/board/allows?user=${req.user.id}&board=${req.params.id}`, {
              headers
            })
        )
        .then(res => res.json())
        .then((body) => {
          if (!body.items.length) {
            res.status(400).json({
              user: 'You dont have a permission to manipulate board'
            });
            reject();
          } else {
            resolve();
          }
        });
    });

  app.post('/upload/files', upload.fields([{ name: 'files' }]), (req, res) => {
    const paths = [];
    const promises = req.files.files.map(file => new Promise((resolve) => {
      const filepath = `${file.path}${path.extname(file.originalname)}`;
      fs.move(file.path, filepath, () => resolve());
      paths.push(path.parse(filepath).base);
    }));
    Promise.all(promises).then(
      () => res.json({
        paths
      })
    );
  });

  proxy({
    app,
    protocol: 'https',
    host: config.api.host,
    prefix: '/bff',
    before: (url, options, cb) => cb([url, {
      method: options.method,
      headers,
      body: options.body
    }]),
    customizer: {
      [uris.apis.images]: {
        POST: {
          before: (url, options, cb, reject) => {
            const json = JSON.parse(options.body);
            let file = json.url;
            if (json.fromUploader) {
              if (file.match(/\.\./)) {
                reject({
                  file: 'Invalid filepath'
                }, 400);
                return;
              }
              file = path.join('tmp', file);
            }
            cloudinary.uploader.upload(file, (result) => {
              if (json.fromUploader) {
                fs.remove(file);
              }
              if (result.error) {
                console.error(result.error);
                reject({
                  file: result.error
                });
                return;
              }
              json.url = result.secure_url;
              json.cloudinary = isVideo(json.url) ? '' : `${result.public_id}.${result.format}`;
              cb([url, {
                ...options,
                body: JSON.stringify(json),
                headers
              }]);
            }, {
              resource_type: isVideo(json.url) ? 'video' : 'auto',
              format: isVideo(json.url) ? undefined : 'png'
            });
          }
        },
        GET: {
          override: (req, res) => {
            const values = req.query;
            confirmAuth(req, res)
              .then(
                () =>
                  fetch(`${apiBase}/apis/board/allows?board=${values.board}&user=${req.user.id}`, {
                    headers
                  })
              )
              .then(res => res.json())
              .then((_res) => {
                if (!_res.items.length) {
                  res.status(400).json({
                    user: 'You dont have a permission to manipulate image'
                  });
                  throw new Error();
                }
                return;
              })
              .then(() => fetch(`${apiBase}/apis/board/images?board=${values.board}`, {
                headers
              }))
              .then(res => res.json())
              .then(_res => res.json(_res))
              .catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        }
      },
      [uris.apis.board]: {
        POST: {
          override: (req, res) => {
            confirmPermission(req, res)
              .then(
                () => fetch(`${apiBase}/apis/board/boards/${req.params.id}`, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify(req.body)
                })
              )
              .then((_res) => {
                if (_res.ok) {
                  res.json({});
                } else {
                  res.status(_res.status).json({});
                }
              }).catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        },
        GET: {
          override: (req, res) => {
            confirmPermission(req, res)
              .then(
                () => fetch(`${apiBase}/apis/board/boards/${req.params.id}`, {
                  method: 'GET',
                  headers
                })
              )
              .then(res => res.json())
              .then((board) => {
                res.json(board);
              })
              .catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        },
        DELETE: {
          override: (req, res) => {
            confirmPermission(req, res)
              .then(
                () => fetch(`${apiBase}/apis/board/boards/${req.params.id}`, {
                  method: 'DELETE',
                  headers
                })
              )
              .then(
                () => fetch(`${apiBase}/apis/board/allows?board=${req.params.id}`, {
                  method: 'DELETE',
                  headers
                })
              )
              .then(() => res.json({}))
              .catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        }
      },
      [uris.apis.boards]: {
        GET: {
          override: (req, res) => {
            const values = req.query;
            confirmAuth(req, res)
              .then(
                () => new Promise((resolve, reject) =>
                  Promise.all([
                    fetch(`${apiBase}/apis/board/allows?user=${req.user.id}`, {
                      headers
                    })
                    .then(_res => _res.json()),
                    fetch(`${apiBase}/apis/board/boards?name=*${values.query || ''}*`, {
                      headers
                    })
                    .then(_res => _res.json()),
                  ]).then(
                    ([allows, boards]) => {
                      resolve(boards.items.filter(board =>
                        _.find(allows.items, allow => allow.board.id === board.id) !== undefined
                      ));
                    }
                  ).catch(err => reject(err))
                )
              )
              .then((boards) => {
                const promises = boards.map(
                  item =>
                    fetch(`${apiBase}/apis/board/images?board=${item.id}&offset=0&limit=1`, {
                      headers
                    })
                      .then(res => res.json())
                      .then(images => ({
                        ...item,
                        image: !images.items.length ? `/images/bg-${item.background.id}.jpg` :
                               images.items[0].cloudinary ? `https://res.cloudinary.com/sideroad/image/upload/c_fill,h_400,w_500/${images.items[0].cloudinary}` :
                               images.items[0].url
                      }))
                );
                return Promise.all(promises).then(items => ({
                  items
                }));
              })
              .then(boards => res.json(boards))
              .catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        }
      }
    }
  });
}
