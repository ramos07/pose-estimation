const express = require ('express');
const router = express.Router();
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const rimraf = require('rimraf')
var ffmpeg = require('ffmpeg');
var FfmpegCommand = require('fluent-ffmpeg')
var framesPath = './frames/'
var videosPath = './videos/'

const posenet = require('@tensorflow-models/posenet')
const tf = require('@tensorflow/tfjs-node')
const{createCanvas, Image} = require('canvas')
const imageScaleFactor = .75
const outputStride = 16
const flipHorizontal = false

router.use(bodyParser.json())

const Storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, './videos')
    },
    filename(req, file, callback){
        callback(null, `${file.originalname}`);
    }
})

const upload = multer({ storage: Storage });

router.post('/upload-video', upload.single('poseVideo'), (req, res) => {

    const tryModel = async () => {
        await extractFrames(); //Extract the frames from the video that is POSTed to the server
        await posenetAnalysis(); //Run the posenet analysis on each frame
    }//end of tryModel function

    extractFrames = async () =>{
        try {
            var process = new ffmpeg(videosPath + req.file.originalname);
            process.then(function (video) {
    
                video.fnExtractFrameToJPG(framesPath, {
                    number: 3,// just get 3 frames from the video
                    file_name : 'pic'
                }, function (error, files) {
                    if (!error)
                        console.log('Extracted frames succesfully from video!')
                });
            }, function (err) {
                console.log('Error: ' + err);
            });
            
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    }//end of extractFrames async function

    posenetAnalysis = async () =>{
        console.log('start');
        var avgConf = 0;
        const net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: 513,
            multiplier: 0.75
        });

        //Go through each frame extracted and run posenet on each frame image
        for(var i = 1; i <= 3; i++){

            //FOR NORMAL IMAGE
            var frameName = framesPath + 'pic_' + i + '.jpg';
            console.log(frameName);
            var img = new Image();
            img.src = frameName;   
            var canvas = createCanvas(img.width, img.height);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var input = await tf.browser.fromPixels(canvas);
            var pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
            var poseLength = pose.keypoints.length;
            //console.log(pose);
            
        
            //FOR FLIPPED IMAGE           
            ctx.translate(0, img.height);
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, 0);
            var input2 = await tf.browser.fromPixels(canvas);
            var pose2 = await net.estimateSinglePose(input2, imageScaleFactor, flipHorizontal, outputStride);
            //console.log(pose2);
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


            //write file as a png to framesPath
            var buf = canvas.toBuffer();

            fs.writeFile(framesPath  + 'pic' + i + '.png', buf, 'base64', function(err) {
                console.log(err);
            });

            //clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }//end of for loop going through frames
    
        //finished video
        console.log('All done!!');
        avgConf = avgConf/i;
        console.log(avgConf);

        //put all new frames back into video
        var proc = new FfmpegCommand();
        proc.addInput(framesPath + 'pic%1d.png')
        .on('start', function(ffmpegCommand) {
            console.log('video started loading');
        })
        .on('progress', function(data) {
            console.log('video is loading...');
        })
        .on('end', function() {
            console.log('video ended loading');
            console.log('Deleting frames and video to save space...')
            //DELTES ALL in path, need to make folders for specific frames
            rimraf(framesPath + '/*' , function () { console.log('Done!, delete frames to save space'); });
            rimraf(videosPath + '/' + req.file.originalname , function () { console.log('Done!, deleted old video to save space'); })

            res.json({
                pose1Data: pose,
                pose2Data: pose2,
                avgConf: avgConf,
            })
        })
        .on('error', function(error) {
            console.log(error)
        })
        .addInputOption('-framerate 20')
        .outputOptions(['-vcodec libx264', '-r 60', '-pix_fmt yuv420p'])
        .output(videosPath + avgConf + 'firstTestFlipCONTRAST.mp4')
        .run();
    }//end of posenetAnalysis async function

    tryModel();

})//end of POST 

module.exports = router;