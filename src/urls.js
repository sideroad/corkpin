import { normalize } from 'koiki';
import config from './config';

const base = normalize(`${config.api.host}:${config.api.port}`);

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
                source: photo.images[0].source,
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
      url: `${base}/apis/board/boards`
    },
    get: {
      url: `${base}/apis/board/boards/:id`
    },
    save: {
      method: 'POST',
      url: `${base}/apis/board/boards`
    }
  },
  image: {
    gets: {
      url: `${base}/apis/board/images`,
      after: (values, res) => {
        const token = values.token;
        const images = res.items;
        const promises = images.map(image =>
          fetch(`https://graph.facebook.com/v2.8/${image.photo}?access_token=${token}&fields=source,name`)
            .then(res => res.json())
            .then(json => ({
              ...json,
              ...image
            }))
        );
        return Promise.all(promises).then(res => ({
          items: res
        }));
      }
    },
    get: {
      url: `${base}/apis/board/images/:id`
    },
    save: {
      method: 'POST',
      url: `${base}/apis/board/images`
    },
    update: {
      method: 'POST',
      url: `${base}/apis/board/images/:id`
    }
  }
};
