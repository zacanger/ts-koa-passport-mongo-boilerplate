import passport from 'koa-passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as LocalStrategy } from 'passport-local'
import User from './user'
import passportConfig from './config'

type User = {
  id: number
}

passport.serializeUser((user: User, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (ctx, email, password, done) => {
      if (email) {
        email = email.toLowerCase()
      }

      User.findOne({ 'local.email': email }, (err, user) => {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false)
        }

        if (!user.validPassword(password)) {
          return done(null, false)
        } else {
          return done(null, user)
        }
      })
    }
  )
)

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (ctx, email, password, done) => {
      if (email) {
        email = email.toLowerCase()
      }

      if (!ctx.user) {
        // not logged in yet
        User.findOne({ 'local.email': email }, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            // existing user
            return done(null, false)
          } else {
            // create user
            const newUser = new User()

            newUser.local.email = email
            // @ts-ignore
            newUser.local.password = newUser.generateHash(password)

            // @ts-ignore
            newUser.save((err) => {
              if (err) {
                return done(err)
              }

              return done(null, newUser)
            })
          }
        })
        // @ts-ignore
      } else if (!ctx.user.local.email) {
        // if the user is logged in but has no local account
        // they're trying to connect a local account
        // first check if one exists with that email
        User.findOne({ 'local.email': email }, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            return done(null, false)
          } else {
            const user = ctx.user
            // @ts-ignore
            user.local.email = email
            // @ts-ignore
            user.local.password = user.generateHash(password)
            // @ts-ignore
            user.save((err) => {
              if (err) {
                return done(err)
              }

              return done(null, user)
            })
          }
        })
      } else {
        // logged in, already has account. ignore.
        return done(null, ctx.user)
      }
    }
  )
)

passport.use(
  // @ts-ignore
  new FacebookStrategy(
    // @ts-ignore 'type boolean is not assignable to type true'
    passportConfig.facebook,
    // @ts-ignore not inferring passReqToCallback type
    (ctx, token, refreshToken, profile, done) => {
      // check if the user is already logged in
      if (!ctx.user) {
        User.findOne({ 'facebook.id': profile.id }, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            // existing user id, no token (unlinked)
            if (!user.facebook.token) {
              user.facebook.token = token
              user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`
              user.facebook.email = (
                profile.emails[0].value || ''
              ).toLowerCase()

              // @ts-ignore
              user.save((err) => {
                if (err) {
                  return done(err)
                }

                return done(null, user)
              })
            }

            // success
            return done(null, user)
          } else {
            // create a new fb user
            const newUser = new User()

            newUser.facebook.id = profile.id
            newUser.facebook.token = token
            newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`
            newUser.facebook.email = (
              profile.emails[0].value || ''
            ).toLowerCase()

            // @ts-ignore
            newUser.save((err) => {
              if (err) {
                return done(err)
              }

              return done(null, newUser)
            })
          }
        })
      } else {
        // user already exists and is logged in, we have to link accounts
        const user = ctx.user

        user.facebook.id = profile.id
        user.facebook.token = token
        user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`
        user.facebook.email = (profile.emails[0].value || '').toLowerCase()

        // @ts-ignore
        user.save((err) => {
          if (err) {
            return done(err)
          }

          return done(null, user)
        })
      }
    }
  )
)

passport.use(
  new TwitterStrategy(
    // @ts-ignore 'type boolean is not assignable to type true'
    passportConfig.twitter,
    (ctx, token, tokenSecret, profile, done) => {
      if (!ctx.user) {
        User.findOne({ 'twitter.id': profile.id }, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            if (!user.twitter.token) {
              user.twitter.token = token
              user.twitter.username = profile.username
              user.twitter.displayName = profile.displayName

              // @ts-ignore
              user.save((err) => {
                if (err) {
                  return done(err)
                }

                return done(null, user)
              })
            }

            return done(null, user)
          } else {
            const newUser = new User()

            newUser.twitter.id = profile.id
            newUser.twitter.token = token
            newUser.twitter.username = profile.username
            newUser.twitter.displayName = profile.displayName

            // @ts-ignore
            newUser.save((err) => {
              if (err) {
                return done(err)
              }

              return done(null, newUser)
            })
          }
        })
      } else {
        const user = ctx.user

        user.twitter.id = profile.id
        user.twitter.token = token
        user.twitter.username = profile.username
        user.twitter.displayName = profile.displayName

        // @ts-ignore
        user.save((err) => {
          if (err) {
            return done(err)
          }

          return done(null, user)
        })
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    // @ts-ignore 'type boolean is not assignable to type true'
    passportConfig.google,
    (ctx, token, refreshToken, profile, done) => {
      if (!ctx.user) {
        User.findOne({ 'google.id': profile.id }, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            if (!user.google.token) {
              user.google.token = token
              user.google.name = profile.displayName
              user.google.email = (profile.emails[0].value || '').toLowerCase()

              // @ts-ignore
              user.save((err) => {
                if (err) {
                  return done(err)
                }

                return done(null, user)
              })
            }

            return done(null, user)
          } else {
            const newUser = new User()

            newUser.google.id = profile.id
            newUser.google.token = token
            newUser.google.name = profile.displayName
            newUser.google.email = (profile.emails[0].value || '').toLowerCase()

            // @ts-ignore
            newUser.save((err) => {
              if (err) {
                return done(err)
              }

              return done(null, newUser)
            })
          }
        })
      } else {
        const user = ctx.user

        user.google.id = profile.id
        user.google.token = token
        user.google.name = profile.displayName
        user.google.email = (profile.emails[0].value || '').toLowerCase()

        // @ts-ignore
        user.save((err) => {
          if (err) {
            return done(err)
          }

          return done(null, user)
        })
      }
    }
  )
)
