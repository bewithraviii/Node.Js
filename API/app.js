const express = require('express');

const path = require('path');

const feedRoutes = require('./routes/feedRoute');
const authRoutes = require('./routes/authRoute');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const multer = require('multer');

const app = express();


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS ,GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose.connect('mongodb+srv://ravipateljigneshpatel137:Ravi3601@nodeshop.azir75m.mongodb.net/Messages')
.then(result => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log('Client Connected');
    });
})
.catch(err => console.log(err));