const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const imageUploadRouter = require('./routes/uploadimage-router')

const app = express();
const mongoose = require('mongoose');
const API_PORT = 3000;

<<<<<<< Updated upstream
<<<<<<< Updated upstream

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())
=======
mongoose.connect('mongodb://127.0.0.1:27017/pose-estimation', {useNewUrlParser: true}).mpcatch(error => handleError(error));


>>>>>>> Stashed changes

=======
mongoose.connect('mongodb://127.0.0.1:27017/pose-estimation', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
>>>>>>> Stashed changes

<<<<<<< Updated upstream
app.get('/', (req, res) => {
  res.send('The Node JS is up and running')
})

app.use('/api', imageUploadRouter)

<<<<<<< Updated upstream
app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`))
=======
app.listen(API_PORT, () => console.log(`Server running on ${API_PORT}`));
>>>>>>> Stashed changes
=======
app.get('/', (req, res) => { //get request to server
    res.send('Node JS server is up and running');
});

app.use('/api', poseRoute);//middleware

app.use((req, res, next) => {
  const error = new Error("Route Not found");
  error.status = 404;//didnt find fitting routes
  next(error);//call any error middleware
})

app.use((error, req, res, next) =>{
  res.status(err.status || 500);
  res.json({
    error: {
      message: error.message //message = any
    }
  });
});

app.listen(API_PORT, () => console.log(`Server running on ${API_PORT}`));
>>>>>>> Stashed changes
