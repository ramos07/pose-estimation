const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoseImage = new Schema(
    {
        img: {
            data: Buffer, 
            contentType: String
        }
    },
);

module.exports = mongoose.model('images', PoseImage);