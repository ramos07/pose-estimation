const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoseImage = new Schema(
    {
        img: {
            imageName: String,
            keypoints: JSON,
        },
    },
);

module.exports = mongoose.model('images', PoseImage);