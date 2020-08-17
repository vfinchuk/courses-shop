const path = require('path')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middlewere/variables')
const userMiddleware = require('./middlewere/user')


const MONGODB_URI = 'mongodb+srv://vladimir:67AGdgLaWy7W2va@cluster0.qkla7.mongodb.net/shop_courses'
const app = express()

const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(handlebars),
  defaultLayout: 'main',
  extname: 'hbs'
})

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI

})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'pages')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)



const PORT = process.env.PORT || 3000

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
