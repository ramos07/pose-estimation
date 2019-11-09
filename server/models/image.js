const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoseImage = new Schema(
    {
        img: {
            imageName: String,
            imageURL: String,
            contentType: String,
            binaryData: Buffer,
        },
        bodyPoints: {
            keypoints: JSON,
        },
    },
);

module.exports = mongoose.model('images', PoseImage);