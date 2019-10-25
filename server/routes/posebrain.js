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

router.get('/posebrain/uploads', (req, res) => {
    PoseImage.find({}, (err, img) => {
        if(err){
            res.send(err);
        }

        console.log(img);
        res.contentType('json');
        res.send(img);
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

        await saveImage(pose);

        res.status(200).json({
            message: 'Keypoints retrieved, imaged saved to db, and keypoints saved to db',
            data: pose,
        });
    };

    const saveImage = async (pose) => {
        
        const poseImage =  new PoseImage();

        poseImage.img.imageName = req.file.originalname;
        poseImage.img.contentType = req.file.mimetype;
        poseImage.img.points = pose;

        await poseImage.save()
        .then(img => {
            console.log('Image saved!');
            console.log('file', req.file);
        });

    };

    tryModel();

});

module.exports = router;