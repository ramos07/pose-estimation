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
    ctx.fillRect(pose.keypoints[0].position.x, pose.keypoints[0].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[1].position.x, pose.keypoints[1].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[2].position.x, pose.keypoints[2].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[3].position.x, pose.keypoints[3].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[4].position.x, pose.keypoints[4].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[5].position.x, pose.keypoints[5].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[6].position.x, pose.keypoints[6].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[7].position.x, pose.keypoints[7].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[8].position.x, pose.keypoints[8].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[9].position.x, pose.keypoints[9].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[10].position.x, pose.keypoints[10].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[11].position.x, pose.keypoints[11].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[12].position.x, pose.keypoints[12].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[13].position.x, pose.keypoints[13].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[14].position.x, pose.keypoints[14].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[15].position.x, pose.keypoints[15].position.y, 20, 20);
    ctx.fillRect(pose.keypoints[16].position.x, pose.keypoints[16].position.y, 20, 20);

	var buf = canvas.toBuffer();
	fs.writeFile('./test.png', buf, 'base64', function(err) {
  	console.log(err);
	});
	
}

tryModel();

module.exports = router;

