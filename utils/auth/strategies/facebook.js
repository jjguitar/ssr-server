const passport = require('passport');
const axios = require('axios');
const boom = require("@hapi/boom");
const { get } = require("lodash");
const { Strategy: FacebookStrategy } = require('passport-facebook');

const { config } = require("../../../config");

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookClientId,
      clientSecret: config.facebookClientSecret,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async function (accessToken, refreshToken, { _json: profile }, cb) {
      //console.log(profile);

      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: 'post',
        data: {
          name: profile.name,
          email: profile.email,
          password: profile.id,
          apiKeyToken: config.apiKeyToken,
        },
      });

      if (!data || status !== 200) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, data);
    }
  )
);