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

  const confirmBoardPermission = (req, res) =>
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

  const confirmBoardOwnerPermission = (req, res) =>
    new Promise((resolve, reject) => {
      confirmAuth(req, res)
        .then(
          () =>
            fetch(`${apiBase}/apis/board/boards/${req.params.id}`, {
              headers
            })
        )
        .then(res => res.json())
        .then((body) => {
          if (body.user !== req.user.id) {
            res.status(400).json({
              user: 'You dont have a permission to manipulate board'
            });
            reject();
          } else {
            resolve();
          }
        });
    });

  const confirmImagePermission = (req, res) =>
    new Promise((resolve, reject) => {
      confirmAuth(req, res)
        .then(
          () =>
            fetch(`${apiBase}/apis/board/allows?board=${req.body.board ? req.body.board : req.query.board}&user=${req.user.id}`, {
              headers
            })
        )
        .then(res => res.json())
        .then((allows) => {
          if (!allows.items.length) {
            res.status(400).json({
              user: 'You dont have a permission to manipulate image'
            });
            reject();
          }
          resolve();
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
          override: (req, res) => {
            confirmImagePermission(req, res)
              .then(
                () =>
                  new Promise((resolve, reject) => {
                    const body = req.body;
                    let file = body.url;
                    if (body.fromUploader) {
                      if (file.match(/\.\./)) {
                        reject({
                          file: 'Invalid filepath'
                        }, 400);
                        return;
                      }
                      file = path.join('tmp', file);
                    }
                    cloudinary.uploader.upload(file, (result) => {
                      if (body.fromUploader) {
                        fs.remove(file);
                      }
                      if (result.error) {
                        console.error(result.error);
                        reject({
                          file: result.error
                        });
                        return;
                      }
                      body.url = result.secure_url;
                      body.cloudinary = isVideo(body.url) ? '' : `${result.public_id}.${result.format}`;
                      resolve(body);
                    }, {
                      resource_type: isVideo(body.url) ? 'video' : 'auto',
                      format: isVideo(body.url) ? undefined : 'png',
                      tags: [body.board]
                    });
                  })
              )
              .then(
                body =>
                  fetch(`${apiBase}/apis/board/images`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body)
                  })
              )
              .then(res => res.json())
              .then(images => res.json(images))
              .catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        },
        GET: {
          override: (req, res) => {
            confirmImagePermission(req, res)
              .then(() => fetch(`${apiBase}/apis/board/images?board=${req.query.board}`, {
                headers
              }))
              .then(res => res.json())
              .then(images => res.json(images))
              .catch(err => console.log(req.originalUrl, err) || res.status(503).json({}));
          }
        }
      },
      [uris.apis.board]: {
        POST: {
          override: (req, res) => {
            confirmBoardPermission(req, res)
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
            confirmBoardPermission(req, res)
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
            confirmBoardOwnerPermission(req, res)
              .then(
                () => fetch(`${apiBase}/apis/board/images?board=${req.params.id}`, {
                  method: 'DELETE',
                  headers
                })
              ).then(
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
