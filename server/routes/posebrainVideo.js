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
const rimraf = require('rimraf');

var framePath = '/Users/jacksonbursch/Documents/testingApp/PosenetV2/posenet/nikoleFrames/frames/';
var videoPath ='/Users/jacksonbursch/Documents/testingApp/PosenetV2/posenet/nikoleFrames/';

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
    var avgConf = 0;
    const net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 513,
        multiplier: 0.75
    });


for(var i = 1; i < 80; i++){

    //FOR NORMAL IMAGE
    var frameName = framePath + 'pic_' + i + '.jpg';
    console.log(frameName);
    var img = new Image();
    img.src = frameName;   
    var canvas = createCanvas(img.width, img.height);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    //ctx.filter = 'contrast(1.7)';
    /*
    var imageData = ctx.getImageData(0,0, img.width, img.height);
    imageData = applyContrast(imageData, 75);
    imageData = applyBrightness(imageData, 50);
    */
    var input = await tf.browser.fromPixels(canvas);
    var pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
    var poseLength = pose.keypoints.length;
    console.log(pose);
    
   
    //FOR FLIPPED IMAGE           
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
            
    //average confidence score -- good for testing
    if (pose.score > pose2.score){
        avgConf = avgConf + pose.score;
    } else{
        avgConf = avgConf + pose2.score;
    }

    /*
    for(const keypoint of pose.keypoints) {
        console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
    }
    console.log('end');
    */

   //Which points do we wanna let in?
    var confindenceCutOff1 = .48;
    var confindenceCutOff2 = .65;
    ctx.fillStyle = "#FF0000";
    var rectSize = 15;
    var j;

        for (j = 0; j < poseLength; j++){
            if(pose.keypoints[j].score > confindenceCutOff1 ){
                ctx.fillRect(pose.keypoints[j].position.x, pose.keypoints[j].position.y, rectSize, rectSize);
            }
        }

//save the points to mongodb
/*
if (pose.score > .1){
        await saveImage(pose);
        console.log('image was saved yo!');
       } else{
        //need to put an error message here that returns back to user
        console.log('Your pose sucks! Try again!');
        console.log('I mean your pose was only ', pose.score);
       }    
*/

//write file as a png to framepath
    var buf = canvas.toBuffer();

    fs.writeFile(framePath  + 'pic' + i + '.png', buf, 'base64', function(err) {
        console.log(err);
    });

//clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    }
    
//finished video
console.log('All done!!');
avgConf = avgConf/i;
console.log(avgConf);

//put all new frames back into video
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
    //DELTES ALL in path, need to make folders for specific frames
    rimraf(framePath , function () { console.log('done with deleting all frames'); });
})
.on('error', function(error) {
    /// error handling
})
.addInputOption('-framerate 20')
.outputOptions(['-vcodec libx264', '-r 60', '-pix_fmt yuv420p'])
.output(videoPath + avgConf + 'firstTestFlipCONTRAST.mp4')
.run();

}



tryModel();


module.exports = router;
