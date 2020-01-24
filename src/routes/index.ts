import authentication from './authentication'
import authorization from './authorization'
import unlink from './unlink'

export default (router, passport) => {
  authentication(router, passport)
  authorization(router, passport)
  unlink(router)

  router.get('/logout', async (ctx) => {
    ctx.logout()
    ctx.redirect('/')
  })
}
