const express = require('express');
const router = express.Router();
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const { createCanvas, Image } = require('canvas');
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const PoseImage = require('../models/image');
const Points = require('../models/points');

router.use(bodyParser.json());

const Storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './uploads');
    },
    filename(req, file, callback){
        callback(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: Storage});

router.post('/posebrain', upload.single('poseImage'), (req, res) => {
    
    var imageData = fs.readFileSync(req.file.path);

    const tryModel = async () => {
        console.log('start');

        const net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: 513,
            multiplier: 0.75,
        });

        const img = new Image();
        img.src = imageData;
        img.width = 225;
        img.height = 225;
        
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        const input = await tf.browser.fromPixels(canvas);

        const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);

        console.log(pose); //All the keypoints of the body as JSON data type

        for(const keypoint of pose.keypoints){
            console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
        }

        console.log('end');

        await savePoints();

        res.status(200).json({
            message: 'Keypoints retrieved, imaged saved to db, and keypoints saved to db',
            data: pose,
        });
    };

    const saveImage = async () => {
        
        const poseImage =  new PoseImage();
        await poseImage.save()
        .then(img => {
            console.log('Image saved!');
            console.log('file', req.file);
        });

    };

    const savePoints = async (pose) => {
        const posePoints = new Points(pose);
        await posePoints.save()
        .then(points => {
            console.log('Points saved!');
        });

    };


    tryModel();
    saveImage();
});

router.get('/posebrain', (req, res) => {
    PoseImage.find({}, 'name ')
});

module.exports = router;