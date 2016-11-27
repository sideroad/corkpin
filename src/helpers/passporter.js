/*eslint no-underscore-dangle: ["error", { "allow": ["_json"] }]*/
import passport from 'passport';
import { Strategy } from 'passport-facebook';
import config from '../config';

export default {

  use: (app) => {
    // passport setup Strategy
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

    passport.use(new Strategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.secret,
      callbackURL: `${config.app.base}/auth/facebook/callback`,
      profileFields: ['id', 'albums', 'photos']
    }, (accessToken, refreshToken, profile, cb) =>
      cb(null, { ...profile, token: accessToken })
    ));

    app.use(passport.initialize());
    app.use(passport.session());

    // Endpoint to confirm authentication is still in valid
    app.get('/auth',
      (req, res, next) => {
        if (req.isAuthenticated()) {
          return next();
        }
        return res.status(401).json({});
      }, (req, res) => {
        res.status(200).json({
          id: req.user.id,
          token: req.user.token
        });
      });

    app.get('/auth/facebook',
      passport.authenticate('facebook', { scope: ['user_photos', 'user_videos', 'user_posts', 'user_friends'], session: true }));

    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { scope: ['user_photos', 'user_videos', 'user_posts', 'user_friends'], session: true, failureRedirect: '/auth/facebook' }),
      (req, res) => {
        res.redirect(req.cookies.redirect);
      });
  }
};
