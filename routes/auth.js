const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne({email})
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          } else {
            res.redirect('/')
          }
        })
      } else {
        req.flash('loginError', 'Incorrect password')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'Current user does not exist')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})



router.post('/register', async (req, res) => {
  try {
    const {email, password, name, confirm} = req.body

    const candidate = await User.findOne({email})

    if (candidate) {
      req.flash('registerError', 'This email already exist')
      res.redirect('/auth/login#register')
    } else {
      const hasPassword = await bcrypt.hash(password, 10)
      const user = User({
        email, password: hasPassword, name, cart: {items: []}
      })
      await user.save()
      res.redirect('/auth/login#login')
    }

  } catch (e) {
    console.log(e)
  }
})

module.exports = router
