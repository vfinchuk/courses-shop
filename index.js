const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const User = require('./models/user')

const app = express()

const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(handlebars),
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'pages')

app.use( async (req, res, next) => {
  try {
    const user  = await User.findById('5f36ed8e33a1114ad080e45b')
    req.user = user
    next()
  } catch (e) {
    console.log(e);
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)



const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = 'mongodb+srv://vladimir:67AGdgLaWy7W2va@cluster0.qkla7.mongodb.net/shop_courses'
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })

    const candidate = await User.findOne()

    if (!candidate) {
      const user = new User({
        email: 'vanter777@gmail.com',
        name: 'Vladimir',
        cart: {items: []}
      })

      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
