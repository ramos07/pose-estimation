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
const PosePoints = require('../models/poseCoord');
const PoseImage = require('../models/poseImage');
const mongoose = require('mongoose');
/*
REQUIRE mongoose
REQUIRE multer
REQUIRE ('..\models\points')
*/
router.use(bodyParser.json());

const Storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './uploads');
    },
    filename(req, file, callback){
        callback(null, `${file.originalname}`);
    },
});


const upload = multer({ storage: Storage}); //Create a variable to route the saving of our images on the server

//Post an image to the server, save it, run Tensorflow analysis on the image
router.post('/', upload.single('poseImage'), (req, res) => {

    var imageData = fs.readFileSync(req.file.path); //get the image from our directory

const upload = multer({ storage: Storage});


router.get('/posebrain', (req, res) => {
    res.status(200).send('You can upload images to posebrain');
});

router.post('/posebrain', upload.single('poseImage'), (req, res) => {
    var imageData = fs.readFileSync(req.file.path);
}
router.get('/uploads', (req, res) => {
  try{
    PoseImage.find({}, (err, img) => {
        console.log(img);
        res.contentType('json');
        res.send(img);
    });
  }catch(err){
    console.log(err);
    next(err);
    res.status(500);
  }
});


router.get('/keypoints', (req, res) => {
  try{
    Points.find({}, (err, points) => {
        if(err){
            res.send(err);
        }
        console.log(req);
        console.log(points);
        res.contentType('json');
        res.send(points);
    });
  }catch(err){
    console.log(err);
    next(err);
    res.status(500);
  }
});

router.post('/posebrain', upload.single('poseImage'), (req, res) => {


    var imageData = fs.readFileSync(req.file.path);
    try{
      const tryModel = async () => {
          console.log('start');
          const net = await posenet.load({
              architecture: 'MobileNetV1',
              outputStride: 16,
              inputResolution: 513,
              multiplier: 0.75,
          });
        }catch(err){
          console.log(res.json(err));
        }

        const image_dimensions = image_size(imageData);
        const img = new Image();
        img.src = imageData;
        img.width = image_dimensions.width;
        img.height = image_dimensions.height;
        img.height = image_dimensions.height;
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const input = await tf.browser.fromPixels(canvas);
        const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
        console.log(pose);

        //FOR FLIPPED IMAGE ACROSS X-AXIS
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0);
        var input2 = await tf.browser.fromPixels(canvas);
        var pose2 = await net.estimateSinglePose(input2, imageScaleFactor, flipHorizontal, outputStride);
        console.log(pose2);
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0);

        //Choosing the best points
         for(var h = 0; h < poseLength; h++){
                if(pose.keypoints[h].score < pose2.keypoints[h].score){
                    pose.keypoints[h] = pose2.keypoints[h];
                    pose.keypoints[h].position.y = img.height - pose2.keypoints[h].position.y;
                }
         }

        try{
          const input = await tf.browser.fromPixels(canvas);
        }catch(err){
          console.log(error);
        }

        try{
          const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
        }catch(err){
          console.log(error);
        }
        console.log(pose);
        for(const keypoint of pose.keypoints){
            console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
        }
        console.log('end');
        var rectSize = 15;
        var poseLength = pose.keypoints.length;
        var i;
        for(i=0; i < poseLength; i++){
            ctx.fillRect(pose.keypoints[i].position.x, pose.keypoints[i].position.y, rectSize, rectSize);
        }
        //draw the lines on the image and connect the points with lines
        ctx.moveTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
        ctx.lineTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
        ctx.lineTo(pose.keypoints[7].position.x, pose.keypoints[7].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[7].position.x, pose.keypoints[7].position.y);
        ctx.lineTo(pose.keypoints[9].position.x, pose.keypoints[9].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
        ctx.lineTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
        ctx.lineTo(pose.keypoints[8].position.x, pose.keypoints[8].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[8].position.x, pose.keypoints[8].position.y);
        ctx.lineTo(pose.keypoints[10].position.x, pose.keypoints[10].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
        ctx.lineTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
        ctx.lineTo(pose.keypoints[13].position.x, pose.keypoints[13].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
        ctx.lineTo(pose.keypoints[14].position.x, pose.keypoints[14].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[13].position.x, pose.keypoints[13].position.y);
        ctx.lineTo(pose.keypoints[15].position.x, pose.keypoints[15].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[14].position.x, pose.keypoints[14].position.y);
        ctx.lineTo(pose.keypoints[16].position.x, pose.keypoints[16].position.y);
        ctx.stroke();
        ctx.moveTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
        ctx.lineTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
        ctx.stroke();
        var buf = canvas.toBuffer();
        fs.writeFile('./uploads/'+req.file.originalname, buf, function(err) {
            console.log(err)
        })
        await saveImage(pose);
        res.status(200).json({
            message: 'Successfull analysis! Body keypoints database.',
            imageName: req.file.originalname,
            //binaryData: buf, //sending the binary data so that we can render image on the client side
        })
    };

    const saveImage = async (pose) => {

        const poseImage =  new PoseImage(); //Create new object of PoseImage to save into database

        poseImage.img.imageName = req.file.originalname; //save the name of the image to the database
        poseImage.img.keypoints = pose; //Save the Posenet JSON data to the database
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
        try{
        await poseImage.save()
        .then(img => {
            console.log('Image succesfully saved!');
        });
            console.log('Image saved!');
            console.log('file', req.file);
        }).catch(){
          console.log(error);
          res.json({message: 'Image not saved'})
        };
       }
    };
    const savePoints = async (pose) => {
        const posePoints = new Points();
        posePoints.points.data = pose;
        await posePoints.save()
        .then(points => {
            console.log('Points saved!');
        }).catch(function(error)){
          console.log(error);
          res.json({message:'Points not saved'})
        };
    };
 tryModel(); //calling trymodel
});

module.exports = router;
