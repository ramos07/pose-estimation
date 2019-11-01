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

const upload = multer({ storage: Storage});

<<<<<<< Updated upstream
router.get('/posebrain', (req, res) => {
    res.status(200).send('You can upload images to posebrain');
});

router.post('/posebrain', upload.single('poseImage'), (req, res) => {

    var imageData = fs.readFileSync(req.file.path);
=======

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

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

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
>>>>>>> Stashed changes

        const tryModel = async () => {
            console.log('start');


            const net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 8,
                inputResolution: 801,
                multiplier: 1.0,
            });

            const img = new Image();
            img.src = imageData;
            img.width = 34;
            img.height = 34;

            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0);

            const input = await tf.browser.fromPixels(canvas);

            const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);

            //console.log(pose); //All the keypoints of the body as JSON data type

            var result = []
            for(const keypoint of pose.keypoints){
              result.push(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
            }
            //console.log(JSON.stringify(result)); // turn json data into array
            //JSON.stringify(result);
            const posePoints = new PosePoints();
            var points = PosePoints({
            _id: new mongoose.Types.ObjectId(),
            nose: req.keypoints[0].x,
            leftEye: result[1],
            rightEye: result[2],
            leftEar: result[3],
            rightEar: result[4],
            leftShoulder: result[5],
            rightShoulder: result[6],
            leftElbow: result[7],
            rightElbow: result[8],
            leftWrist: result[9],
            rightWrist: result[10],
            leftHip: result[11],
            rightHip: result[12],
            leftKnee: result[13],
            rightKnee: result[14],
            leftAnkle:result[15],
            rightAnkle: result[16],
            });



            posePoints.save().then(result => {
            console.log(result);res.status(201).json({
             message: "Handling POST requests to /poseCoord",
             createdProduct: result
            });
            })
            .catch(err =>  {
            console.log(err);
            res.status(500).json({
                    error: err
                  });
                  });

            console.log('end');


        }//end of tryModel async method

        const saveImage = async () => {
          const poseImage = new PoseImage();
          poseImage.save().then(result => {
          console.log(result);res.status(201).json({
           message: "Handling POST requests to /poseImage",
           createdProduct: result
          });
          })
          .catch(err =>  {
          console.log(err);
          res.status(500).json({
                  error: err
                });
                });
        };
/*
        const savePoints = async () => {
          const posePoints = new PosePoints();

          var points = new PosePoints({
          _id: new mongoose.Types.ObjectId(),
          nose: result[0],
          leftEye: result[1],
          rightEye: result[2],
          leftEar: result[3],
          rightEar: result[4],
          leftShoulder: result[5],
          rightShoulder: result[6],
          leftElbow: result[7],
          rightElbow: result[8],
          leftWrist: result[9],
          rightWrist: result[10],
          leftHip: result[11],
          rightHip: result[12],
          leftKnee: result[13],
          rightKnee: result[14],
          leftAnkle:result[15],
          rightAnkle: result[16],
          });

          posePoints.save().then(result => {
          console.log(result);res.status(201).json({
           message: "Handling POST requests to /poseCoord",
           createdProduct: result
          });
          })
          .catch(err =>  {
          console.log(err);
          res.status(500).json({
                  error: err
                });
                });

        };

*/
        tryModel(); //calling trymodel
        saveImage();
        //savePoints();

});

module.exports = router;
