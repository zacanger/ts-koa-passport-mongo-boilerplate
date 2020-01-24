export default {
  facebook: {
    clientID: 'facebook-client-id',
    clientSecret: 'facebook-client-secret',
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    profileURL:
      'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'email', 'name'],
    passReqToCallback: true,
  },

  twitter: {
    consumerKey: 'twitter-consumer-ket',
    consumerSecret: 'twitter-consumer-secret',
    callbackURL: 'http://localhost:4000/auth/twitter/callback',
    passReqToCallback: true,
  },

  google: {
    clientID: 'google-client-id',
    clientSecret: 'google-client-secret',
    callbackURL: 'http://localhost:4000/auth/google/callback',
    passReqToCallback: true,
  },
}
