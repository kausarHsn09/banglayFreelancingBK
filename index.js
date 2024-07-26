require('dotenv').config({ path: './.env' });

const app = require('./app');
const mongoose = require('mongoose')
const DB=process.env.DATABASE_URL

mongoose.connect(DB).then(()=>console.log('DB connected'))

const port = 8080
app.listen(port,()=>{
    console.log(`Server is running on port ${port||5000}`)
}) 