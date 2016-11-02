import config from '../config';

export default function login(cookie) {
  return new Promise((resolve, reject) => {
    if (__SERVER__) {
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
    } else {
      FB.getLoginStatus((res) => {
        console.log(res);
        if (res.status !== 'connected') {
          FB.login((res) => {
            cookie.set('token', res.authResponse.accessToken);
            resolve({
              id: res.authResponse.userID,
              token: res.authResponse.accessToken
            });
          }, { scope: 'user_photos' });
        } else {
          cookie.set('token', res.authResponse.accessToken);
          resolve({
            id: res.authResponse.userID,
            token: res.authResponse.accessToken
          });
        }
      }, true);
    }
  });
}
