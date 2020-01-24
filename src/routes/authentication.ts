const authnConfig = {
  successRedirect: '/profile',
  failureRedirect: '/',
}

export default (router, passport) => {
  router.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
    })
  )

  router.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
    })
  )

  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
  )

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', authnConfig)
  )

  router.get(
    '/auth/twitter',
    passport.authenticate('twitter', { scope: 'email' })
  )

  router.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', authnConfig)
  )

  router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )

  router.get(
    '/auth/google/callback',
    passport.authenticate('google', authnConfig)
  )
}
