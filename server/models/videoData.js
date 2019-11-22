const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoseVideo = new Schema(
    {
        video: {
            videoName: String,
            framePoseData: [JSON],
        },
    },
);

module.exports = mongoose.model('videos', PoseVideo);