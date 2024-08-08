require('dotenv').config({ path: './.env' });
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE_URL;

mongoose.connect(DB, {
    ssl: true 
}).then(() => {
    console.log('DB connected');
}).catch(err => {
    console.error('DB connection error:', err.message);
});

const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
