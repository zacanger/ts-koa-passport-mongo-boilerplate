import * as http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import mid from 'koa-mid'
import passport from 'koa-passport'
import session from 'koa-session'
import mongoose from 'mongoose'
import routes from './routes'
import './passport'

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/passport')

const port = process.env.PORT || 4000
const app: Koa = new Koa()
const router = new Router()

app.proxy = true
app.keys = ['add-a-secret-here']
app.use(session(app))

app.use(mid)
app.use(passport.initialize())
app.use(passport.session())
routes(router, passport)
app.use(router.routes())
app.use(router.allowedMethods())

app.use((ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/')
  }
})

const handler = app.callback()

const server = http.createServer((req, res) => {
  handler(req, res)
})

const main = () => {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`auth listening on ${port}`)
  })

  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0)
    })
  })
}

main()
