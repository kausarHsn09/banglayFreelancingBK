const morgan = require('morgan')
const cors= require('cors')
const express = require('express');
const app = express()
const session = require('express-session');


//routes 
const userRoute = require('./routes/userRoute');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const couseVideoRoutes = require('./routes/couseVideoRoutes');
const courseRoutes = require('./routes/courseRoutes');



app.use(express.json({}))
app.use(morgan('dev'))
app.use(cors())


// Configure Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));



//Authentication routes
app.use('/api/v1/users',userRoute)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/enrollments',enrollmentRoutes)
app.use('/api/v1/videos',couseVideoRoutes)





module.exports = app