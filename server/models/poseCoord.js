var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PosePoints = new mongoose.Schema({
        nose: [{type: String}],
        leftEye: [{type: String}],
        rightEye: [{type: String}],
        leftEar: [{type: String}],
        rightEar: [{type: String}],
        leftShoulder: [{type: String}],
        rightShoulder: [{type: String}],
        leftElbow: [{type: String}],
        rightElbow: [{type: String}],
        leftWrist: [{type: String}],
        rightWrist: [{type: String}],
        leftHip: [{type: String}],
        rightHip: [{type: String}],
        leftKnee: [{type: String}],
        rightKnee: [{type: String}],
        leftAnkle: [{type: String}],
        rightAnkle: [{type: String}]
});

var Point = mongoose.model('poseCoord', PosePoints);


module.exports = Point;
