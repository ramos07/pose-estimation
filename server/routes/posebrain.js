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

        await poseImage.save() //Save the image and the desired characteristics to the database
        .then(img => {
            console.log('Image succesfully saved!');
        });

    };

    tryModel(); 

});

module.exports = router;