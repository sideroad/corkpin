import config from './config';

const base = config.app.base;

export default {
  album: {
    gets: {
      url: 'https://graph.facebook.com/v2.8/me/albums',
      after: (values, { body: res }) => {
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
      url: `${base}/bff/apis/board/boards`,
      credentials: 'include'
    },
    get: {
      url: `${base}/bff/apis/board/boards/:id`,
      credentials: 'include'
    },
    update: {
      method: 'POST',
      url: `${base}/bff/apis/board/boards/:id`,
      credentials: 'include'
    },
    save: {
      method: 'POST',
      url: `${base}/bff/apis/board/boards`,
      credentials: 'include'
    },
    delete: {
      method: 'DELETE',
      url: `${base}/bff/apis/board/boards/:id`,
      credentials: 'include'
    }
  },
  font: {
    gets: {
      url: `${base}/bff/apis/board/fonts`,
      credentials: 'include'
    },
    get: {
      url: `${base}/bff/apis/board/fonts/:id`,
      credentials: 'include'
    }
  },
  image: {
    gets: {
      url: `${base}/bff/apis/board/images`,
      credentials: 'include'
    },
    get: {
      url: `${base}/bff/apis/board/images/:id`,
      credentials: 'include'
    },
    save: {
      method: 'POST',
      url: `${base}/bff/apis/board/images`,
      credentials: 'include'
    },
    update: {
      method: 'POST',
      url: `${base}/bff/apis/board/images/:id`,
      credentials: 'include'
    },
    delete: {
      method: 'DELETE',
      url: `${base}/bff/apis/board/images/:id`,
      credentials: 'include'
    }
  },
  allow: {
    gets: {
      url: `${base}/bff/apis/board/allows`,
      after: (values, { body: res }) => {
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
      url: `${base}/bff/apis/board/allows`
    },
    delete: {
      method: 'DELETE',
      url: `${base}/bff/apis/board/allows`
    }
  },
  background: {
    gets: {
      url: `${base}/bff/apis/board/backgrounds`
    }
  },
  user: {
    gets: {
      url: 'https://graph.facebook.com/v2.8/me/friends',
      after: (values, { body: res }) => Promise.resolve({
        items: res.data.map(item => ({
          id: item.id,
          name: item.name,
          image: `https://graph.facebook.com/v2.8/${item.id}/picture?access_token=${values.access_token}`
        }))
      })
    }
  }
};
