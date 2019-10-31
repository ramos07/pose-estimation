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
router.use(express.static('/uploads'));

//Create a storage to keep the images that are being uploade to the server 
const Storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './uploads');
    },
    filename(req, file, callback){
        callback(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: Storage}); //Create a variable to route the saving of our images on the server

//Display all the images that have been uploaded to the server
router.get('/images', (req, res) => {

    PoseImage.find({}, (err, img) => {

        if(err){
            res.send(err);
        }

        console.log(img);
        res.contentType('json');
        res.send(img);
    });cd 
});

//Get the url of the images on the server
router.get('/images', (req , res) => {
    fs.readFile('/uploads' + req.url, function(err, data) {
        if(err){
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }

        res.writeHead(200);
        res.send(data);
    });
});

//Post an image to the server, save it, run Tensorflow analysis on the image
router.post('/', upload.single('poseImage'), (req, res) => {
    
    var imageData = fs.readFileSync(req.file.path); //get the image from our directory

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
            message: 'Successfull analysis! Body keypoints and image saved to database.',
            fileUrl: 'http://localhost:3000/posebrain/images/' + req.file.filename,
            data: pose,
        });
    };

    const saveImage = async (pose) => {
        
        const poseImage =  new PoseImage(); //Create new object of PoseImage to save into database

        //poseImage.img.imageName = req.file.originalname; //save the name of the image to the database
        //poseImage.img.contentType = req.file.mimetype; //save the content type of the image to the database
        poseImage.img.binaryData = fs.readFileSync(req.file.path); //Save the binary buffer of the image to the database
        //poseImage.bodyPoints.keypoints = pose; //Save the Posenet JSON data to the database

        await poseImage.save() //Save the image and the desired characteristics to the database
        .then(img => {
            console.log('Image succesfully saved!');
            //console.log('file', fs.readFileSync(req.file.path));
            //console.log('file', fs.readlink(req.file.path));
        });

    };

    tryModel(); 

});

module.exports = router;