require('dotenv').config({ path: './.env' });
const app = require('./app');
const mongoose = require('mongoose');
const User = require('./models/userModel')
const cron = require('node-cron');

const DB = process.env.DATABASE_URL;

mongoose.connect(DB, {
    ssl: true ,
     
   
}).then(() => {
    console.log('DB connected');
    //  updateUsers();
}).catch(err => {
    console.error('DB connection error:', err.message);
});

// async function updateUsers() {
//     const result = await User.updateMany(
//         { tasksLeft: { $exists: false } },
//         { $set: { tasksLeft: 200 } }
//     );
//     console.log('Update result:', result); // This will show all properties of the result
//     if (result.nModified !== undefined) {
//         console.log(`Updated ${result.nModified} users`);
//     } else {
//         console.log(`Updated details unavailable`);
//     }
//     mongoose.disconnect();
// }


async function resetTasks() {
    const taskLimit = 200; // Adjust this number based on your specific needs
    const result = await User.updateMany({}, { $set: { tasksLeft: taskLimit } });
    console.log(`Tasks reset for all users. Count: ${result.modifiedCount}`);
}

// Schedule the task reset to run at midnight every day in the Asia/Dhaka timezone
cron.schedule('0 0 * * *', resetTasks, {
    scheduled: true,
    timezone: "Asia/Dhaka"
});


const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
