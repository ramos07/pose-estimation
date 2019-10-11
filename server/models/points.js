const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Points = new Schema({
    points: {
        data: JSON,
    },
}); 

module.exports = mongoose.model('points', Points);
