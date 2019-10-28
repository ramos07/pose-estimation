const express = require ('express');
const router = express.Router();
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const PNG = require('png-js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const image_size = require('image-size');
const bodyParser = require('body-parser');
const PoseImage = require('../models/image');
router.use(bodyParser.json()); 
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('ffmpeg');
var FfmpegCommand = require('fluent-ffmpeg');
FfmpegCommand.setFfmpegPath(ffmpegPath);

var framePath = '/Users/jacksonbursch/Documents/testingApp/PosenetV2/posenet/charlieFrames/';

const {
    createCanvas, Image
} = require('canvas')
const imageScaleFactor = .75;
const outputStride = 16;
const flipHorizontal = false;

try {
    var process = new ffmpeg(framePath + 'charlieTest2.mp4');
    process.then(function (video) {
        // Callback mode
        video.fnExtractFrameToJPG(framePath, {            
            file_name : 'pic'
        }, function (error, files) {
            if (!error)
                console.log('Frames: ' + files);
        });
    }, function (err) {
        console.log('Error: ' + err);
    });
} catch (e) {
    console.log(e.code);
    console.log(e.msg);
}
 

const saveImage = async (pose) => {
        
        const poseImage =  new PoseImage();
       // poseImage.img.data = req.file.path;
       // poseImage.img.contentType = req.file.mimetype;
        poseImage.img.points = pose;
        await poseImage.save()
        .then(img => {
            console.log('Image saved!');
        });

    };

const tryModel = async() => {
    console.log('start');

    const net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 513,
        multiplier: 0.75
    });

var i;
var frameName = framePath + 'pic_' + i + '.jpg';
//while(frameName != null){
for(i = 1; i <103; i++){
    var frameName = framePath + 'pic_' + i + '.jpg';
    console.log(frameName);

    const img = new Image();
    img.src = frameName;   
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    const input = await tf.browser.fromPixels(canvas);
    const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
    console.log(pose);
    /*
    for(const keypoint of pose.keypoints) {
        console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
    }
    console.log('end');
    */
    var confindenceCutOff1 = .7;
    var confindenceCutOff2 = .75;
    ctx.fillStyle = "#FF0000";
    var rectSize = 20;
    var poseLength = pose.keypoints.length;
    var j;
    for (j = 0; j < poseLength; j++){
        if(pose.keypoints[j].score > confindenceCutOff1 ){
            ctx.fillRect(pose.keypoints[j].position.x, pose.keypoints[j].position.y, rectSize, rectSize);
        }
    }

/*
if (pose.score > .5){
        await saveImage(pose);

        console.log('image was saved yo!');
       } else{
        //need to put an error message here that returns back to user
        console.log('Your pose sucks! Try again!');
        console.log('I mean your pose was only ', pose.score);
       }    
*/

if((pose.keypoints[5].score > confindenceCutOff2) && (pose.keypoints[6].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
    ctx.lineTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
    ctx.stroke();
}
if((pose.keypoints[5].score > confindenceCutOff2) && (pose.keypoints[7].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
    ctx.lineTo(pose.keypoints[7].position.x, pose.keypoints[7].position.y);
    ctx.stroke();
}
if((pose.keypoints[5].score > confindenceCutOff2) && (pose.keypoints[11].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
    ctx.lineTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
    ctx.stroke();
}
if((pose.keypoints[7].score > confindenceCutOff2) && (pose.keypoints[9].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[7].position.x, pose.keypoints[7].position.y);
    ctx.lineTo(pose.keypoints[9].position.x, pose.keypoints[9].position.y);
    ctx.stroke();
}

if((pose.keypoints[6].score > confindenceCutOff2) && (pose.keypoints[8].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
    ctx.lineTo(pose.keypoints[8].position.x, pose.keypoints[8].position.y);
    ctx.stroke();
}
if((pose.keypoints[8].score > confindenceCutOff2) && (pose.keypoints[10].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[8].position.x, pose.keypoints[8].position.y);
    ctx.lineTo(pose.keypoints[10].position.x, pose.keypoints[10].position.y);
    ctx.stroke();
}
if((pose.keypoints[6].score > confindenceCutOff2) && (pose.keypoints[12].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
    ctx.lineTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
    ctx.stroke();
}
if((pose.keypoints[11].score > confindenceCutOff2) && (pose.keypoints[13].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
    ctx.lineTo(pose.keypoints[13].position.x, pose.keypoints[13].position.y);
    ctx.stroke();
}
if((pose.keypoints[12].score > confindenceCutOff2) && (pose.keypoints[14].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
    ctx.lineTo(pose.keypoints[14].position.x, pose.keypoints[14].position.y);
    ctx.stroke();
}
if((pose.keypoints[13].score > confindenceCutOff2) && (pose.keypoints[15].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[13].position.x, pose.keypoints[13].position.y);
    ctx.lineTo(pose.keypoints[15].position.x, pose.keypoints[15].position.y);
    ctx.stroke();
}
if((pose.keypoints[14].score > confindenceCutOff2) && (pose.keypoints[16].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[14].position.x, pose.keypoints[14].position.y);
    ctx.lineTo(pose.keypoints[16].position.x, pose.keypoints[16].position.y);
    ctx.stroke();
}
if((pose.keypoints[11].score > confindenceCutOff2) && (pose.keypoints[12].score > confindenceCutOff2)){
    ctx.moveTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
    ctx.lineTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
    ctx.stroke();
}


    var buf = canvas.toBuffer();

    fs.writeFile(framePath  + 'pic' + i + '.png', buf, 'base64', function(err) {
        console.log(err);
    });


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
   }

console.log('All done!!');
var proc = new FfmpegCommand();
proc.addInput(framePath + 'pic%1d.png')
.on('start', function(ffmpegCommand) {
    console.log('video started loading');
})
.on('progress', function(data) {
    console.log('video is loading...');
})
.on('end', function() {
    console.log('video ended loading');
})
.on('error', function(error) {
    /// error handling
})
.addInputOption('-framerate 8')
.outputOptions(['-vcodec libx264', '-r 60', '-pix_fmt yuv420p'])
.output(framePath + 'fourthTest.mp4')
.run();

fs.unlinkSync(framePath + '*.png');
fs.unlinkSync(framePath + '*.jpg');
fs.unlink(framePath + '*.png');
fs.unlink(framePath + '*.jpg');
}



tryModel();


module.exports = router;
