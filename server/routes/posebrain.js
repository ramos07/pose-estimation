const express = require ('express');
const router = express.Router();
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const PNG = require('png-js');
var fs = require('fs');
var path = require('path');

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
    
    var rectSize = 15;
    var poseLength = pose.keypoints.length;
    var i;
    for (i = 0; i < poseLength; i++){
	ctx.fillRect(pose.keypoints[i].position.x, pose.keypoints[i].position.y, rectSize, rectSize);
    }

    var buf = canvas.toBuffer();
    fs.writeFile('./test.png', buf, 'base64', function(err) {
       console.log(err);
    });
	
}

tryModel();

module.exports = router;

