const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const imageUploadRouter = require('./routes/uploadimage-router')

const app = express();
const API_PORT = 3000;


app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('The Node JS is up and running')
})

app.use('/api', imageUploadRouter)

app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`))