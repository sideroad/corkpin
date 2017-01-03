import { normalize, proxy } from 'koiki';
import cloudinary from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import isVideo from 'is-video';

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
    'x-chaus-client': config.chaus.client,
    'x-chaus-secret': config.chaus.secret
  };

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
      ...options,
      headers: {
        ...options.headers,
        ...headers
      }
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
              cb([url, {
                ...options,
                body: JSON.stringify(json),
                headers: {
                  ...options.headers,
                  ...headers,
                  'content-length': JSON.stringify(json).length
                }
              }]);
            }, { resource_type: isVideo(json.url) ? 'video' : 'auto' });
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
