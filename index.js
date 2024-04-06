const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config({path:'./config.env'})


const DB=process.env.DATABASE_URL

mongoose.connect(DB).then(()=>console.log('DB connected'))

const port = 8080
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})