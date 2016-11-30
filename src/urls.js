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
      url: `${base}/api/boards`,
      credentials: 'include'
    },
    get: {
      url: `${api}/apis/board/boards/:id`
    },
    update: {
      method: 'POST',
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
    gets: {
      url: `${api}/apis/board/allows`,
      after: (values, res) => {
        const token = values.access_token;
        const allows = res.items;
        const promises = allows.map(allow =>
          fetch(`https://graph.facebook.com/v2.8/${allow.user}?access_token=${token}`)
            .then(res => res.json())
            .then(res => ({
              id: res.id,
              name: res.name,
              image: `https://graph.facebook.com/v2.8/${res.id}/picture?access_token=${token}`
            }))
        );
        return Promise.all(promises).then(res => ({
          items: res
        }));
      }
    },
    save: {
      method: 'POST',
      url: `${api}/apis/board/allows`
    },
    delete: {
      method: 'DELETE',
      url: `${api}/apis/board/allows`
    }
  },
  background: {
    gets: {
      url: `${api}/apis/board/backgrounds`
    }
  },
  user: {
    gets: {
      url: 'https://graph.facebook.com/v2.8/me/friends',
      after: (values, res) =>
        new Promise((resolve) => {
          resolve({
            items: res.data.map(item => ({
              id: item.id,
              name: item.name,
              image: `https://graph.facebook.com/v2.8/${item.id}/picture?access_token=${values.token}`
            }))
          });
        })
    }
  }
};
