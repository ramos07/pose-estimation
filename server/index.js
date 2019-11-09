const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const poseRoute = require('./routes/posebrain');
const mongoose = require('mongoose');
const app = express();
const API_PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/pose-estimation', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Node JS server is up and running');
});

app.use('/posebrain', poseRoute);

app.listen(API_PORT, () => console.log(`Server running on ${API_PORT}`));