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
//const poseImage = require('..models/image');


router.use(bodyParser.json());

const Storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './uploads');
    },
    filename(req, file, callback){
        callback(null, `${file.originalname}`);
    },
});

const PoseStorage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './uploads');
    },
    filename(req, file, callback){
        callback(null, `${file.originalname}`);
    },
});
const upload = multer({ storage: Storage});
const poseupload = multer({ storage: PoseStorage});


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

router.post('/posebrain', poseupload.single('poseImage'), (req, res) => {

    var imageData = fs.readFileSync(req.file.path);

    try{
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

            //Saving image to database
            

            res.status(200).json({
                message: 'Got the keypoints!!',
                data: pose,
            });



        }//end of tryModel async method

        tryModel();

    }catch(e){
        console.log(e);
    }

});//end of POST to /posebrain
router.post('/posebrain', upload.single('poseImage'), (req, res) => {

    var imageData = fs.readFileSync(req.file.path);

    try{
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

            //Saving image to database
            

            res.status(200).json({
                message: 'Got the keypoints!!',
                data: pose,
            });



        }//end of tryModel async method

        tryModel();

    }catch(e){
        console.log(e);
    }

});//end of POST to /posebrain

module.exports = router;
