const unlink = (strategy, ctx) => {
  const user = ctx.user
  ;['email', 'token', 'password'].forEach((el) => {
    user[strategy][el] = undefined
  })
  user.save((_) => {
    ctx.redirect('/profile')
  })
}

export default (router) => {
  router.get('/unlink/local', (ctx) => {
    unlink('local', ctx)
  })

  router.get('/unlink/facebook', (ctx) => {
    unlink('facebook', ctx)
  })

  router.get('/unlink/twitter', (ctx) => {
    unlink('twitter', ctx)
  })

  router.get('/unlink/google', (ctx) => {
    unlink('google', ctx)
  })
}
