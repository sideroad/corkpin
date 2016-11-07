import config from '../config';

export default function login(cookie, redirect) {
  cookie.set('redirect', redirect);
  return new Promise((resolve, reject) => {
    fetch(`https://graph.facebook.com/v2.8/me?client_id=${config.facebook.appId}&access_token=${cookie.get('token')}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return reject(res);
      })
      .then((res) => {
        resolve({
          id: res.id,
          token: cookie.get('token')
        });
      })
      .catch(err => reject(err));
  });
}
