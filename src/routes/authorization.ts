const authzConfig = {
  successRedirect: '/profile',
  failureRedirect: '/',
}

export default (router, passport) => {
  router.post(
    '/connect/local',
    passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/connect/local',
    })
  )

  router.get(
    '/connect/facebook',
    passport.authorize('facebook', { scope: ['public_profile', 'email'] })
  )

  router.get(
    '/connect/facebook/callback',
    passport.authorize('facebook', authzConfig)
  )

  router.get(
    '/connect/twitter',
    passport.authorize('twitter', { scope: 'email' })
  )

  router.get(
    '/connect/twitter/callback',
    passport.authorize('twitter', authzConfig)
  )

  router.get(
    '/connect/google',
    passport.authorize('google', { scope: ['profile', 'email'] })
  )

  router.get(
    '/connect/google/callback',
    passport.authorize('google', authzConfig)
  )
}
