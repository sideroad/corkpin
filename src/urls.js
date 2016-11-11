import { normalize } from 'koiki';
import config from './config';

const base = config.app.base;
const api = normalize(`${config.api.host}:${config.api.port}`);

export default {
  album: {
    gets: {
      url: 'https://graph.facebook.com/v2.8/me/albums',
      after: (values, res) => {
        const token = values.access_token;
        const albums = res.data;
        const promises = albums.map(album =>
          fetch(`https://graph.facebook.com/v2.8/${album.id}/photos?access_token=${token}&fields=id,name,images`)
            .then(res => res.json())
            .then(res => ({
              id: album.id,
              name: album.name,
              images: res.data.map(photo => ({
                id: photo.id,
                url: photo.images[0].source,
                name: photo.name
              }))
            }))
        );
        return Promise.all(promises).then(res => ({
          items: res.filter(album => album.images.length)
        }));
      }
    }
  },
  board: {
    gets: {
      url: `${api}/apis/board/boards`
    },
    get: {
      url: `${api}/apis/board/boards/:id`
    },
    save: {
      method: 'POST',
      url: `${api}/apis/board/boards`
    }
  },
  image: {
    gets: {
      url: `${base}/api/images`,
      mode: 'cors',
      credentials: 'include'
    },
    get: {
      url: `${api}/apis/board/images/:id`
    },
    save: {
      method: 'POST',
      url: `${api}/apis/board/images`
    },
    update: {
      method: 'POST',
      url: `${api}/apis/board/images/:id`
    }
  },
  allow: {
    save: {
      method: 'POST',
      url: `${api}/apis/board/allows`
    }
  }
};
