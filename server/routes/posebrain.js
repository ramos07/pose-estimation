
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
const image_size = require('image-size');
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

router.get('/uploads', (req, res) => {
    PoseImage.find({}, (err, img) => {
        if(err){
            res.send(err);
        }

        console.log(img);
        res.contentType('json');
        res.send(img);
    });
});

router.get('/keypoints', (req, res) => {
    Points.find({}, (err, points) => {
        if(err){
            res.send(err);
        }

        console.log(points);

        res.contentType('json');
        res.send(points);
    });
});

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

        const image_dimensions = image_size(imageData);

        const img = new Image();
        img.src = imageData;
        img.width = image_dimensions.width;
        img.height = image_dimensions.height;
        
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        const input = await tf.browser.fromPixels(canvas);

        const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);

        console.log(pose); 

        for(const keypoint of pose.keypoints){
            console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
        }

        console.log('end');

        await savePoints(pose);

        await saveImage();

        res.status(200).json({
            message: 'Keypoints retrieved, imaged saved to db, and keypoints saved to db',
            data: pose,
        });
    };

    const saveImage = async () => {
        
        const poseImage =  new PoseImage();
        poseImage.img.data = req.file.path;
        poseImage.img.contentType = req.file.mimetype;
        await poseImage.save()
        .then(img => {
            console.log('Image saved!');
            console.log('file', req.file);
        });

    };

    const savePoints = async (pose) => {
        const posePoints = new Points();
        posePoints.points.data = pose;
        await posePoints.save()
        .then(points => {
            console.log('Points saved!');
        });

    };

    tryModel();

    //comment

});

router.get('/posebrain', (req, res) => {
    PoseImage.find({}, 'name ')
});

module.exports = router;

const express = require ('express');
const router = express.Router();
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const PNG = require('png-js');

var testHandstand = '/Users/jacksonbursch/Documents/testingApp/PosenetV2/posenet/testHandstand.jpg';
var personTest = '/Users/jacksonbursch/Documents/testingApp/PosenetV2/posenet/personTest.jpg'; 

const {
    createCanvas, Image
} = require('canvas')
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

const tryModel = async() => {
    console.log('start');
        const net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 513,
        multiplier: 0.75
        });
    const img = new Image();
    img.src = personTest;
    img.width = 34;
    img.height = 34;
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
	
    const input = await tf.browser.fromPixels(canvas);


    const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
    console.log(pose);
    for(const keypoint of pose.keypoints) {
        console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
    }
    console.log('end');
}

tryModel();

module.exports = router;
