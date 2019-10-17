const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const imageUploadRouter = require('./routes/uploadimage-router')

const app = express();
const mongoose = require('mongoose');
const API_PORT = 3000;

<<<<<<< Updated upstream

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())

=======
mongoose.connect('mongodb://127.0.0.1:27017/pose-estimation', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
>>>>>>> Stashed changes

app.get('/', (req, res) => {
  res.send('The Node JS is up and running')
})

app.use('/api', imageUploadRouter)

<<<<<<< Updated upstream
app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`))
=======
app.listen(API_PORT, () => console.log(`Server running on ${API_PORT}`));
>>>>>>> Stashed changes
