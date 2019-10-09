const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const poseRoute = require('./routes/posebrain');
const app = express();
const API_PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Node JS server is up and running');
});

app.use('/api', poseRoute);

app.listen(API_PORT, () => console.log(`Server running on ${API_PORT}`));