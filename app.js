require('dotenv').config({ path: './locker.env' });

require('./services/background-services/cronJobs');

// const { sendPushNotification } = require('./services/firebase/firebase_services');

const express = require('express');

const app = express();

const mongoose = require('mongoose');


// Routes - imports

const authRoutes = require('./routes/authentication/auth')

const userRoutes = require('./routes/users')

const salahRoutes = require('./routes/third-party/salah')

const quranRoutes = require('./routes/third-party/quran');

const hadithRoutes = require('./routes/third-party/hadith')

app.use(express.json());

app.use(authRoutes)

app.use(userRoutes)

app.use(salahRoutes)

app.use(quranRoutes);

app.use(hadithRoutes)

  

app.use((error,req,res,next)=>{
    const message = error.message;
    const statusCode = error.statusCode || 500;
    const errors = error.errors || [];
    res.status(statusCode).json({
        message:message || 'An unexpected error occurred',
        errors:errors
    
    })
})

mongoose.connect(process.env.DATABASE_URL).then(result=> {
    console.log("Database is connected!");
    app.listen(3000, () => {
        console.log("Server is on at port:3000, lets go.");
    })
    
}).catch(error => {
    console.log(error);
    
})

