# uMove - University of Movement
## Project Description
This project was created as our California State University, Long Beach (CSULB) Senior Project from January-December 2019. Our goal is to have an application where students of movement can come and have a safe place where they can not only see their movement, but receive corrections as well. Through the use of artificial intelligence and a good architectual framework, we'll be able to start the foundation for a school that empowers its students to become the teachers; with the promise that we will be constantly learning right alongside you. 

## Getting Started
### "Out of the Box" Backend
* Note: This was done on macOS, so Windows might be a little different
* Make sure to have [homebrew](https://brew.sh/) and node installed, if node is not already installed type "brew install node" into the Command Line Terminal (CLT)
* Check versions by typing "npm -v" and "node -v" into the CLT, I'm using npm 6.13.4 and node v12.14.1
* To change your version of node, type "npm install -g n" (node package manager) then "sudo n 12.14.1"
* Clone github repo
* Go into github repo and then into the server directory
* **IMPORTANT** - type "npm install @tensorflow/tfjs-node" into CLT
* MongoDB is optional (Good [guide](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) for installation)
* Type "node index" into CLT and make sure it says "Server running on port 3000"
* Install the very useful testing program [Postman](https://www.postman.com/downloads/)
* Create a "POST" request like the example below, put desired picture in "VALUE" field, keep the "KEY" the same as shown
* Press "Send" and check the upload folder in your server directory to see your body analyzed!
<p align="center">
  <img src="https://github.com/ramos07/pose-estimation/blob/master/videos/Screen%20Shot%202020-03-30%20at%204.58.21%20PM.png" width="800" height="250" title="Example of Postman">
</p>


### Tips for Usage
Make sure the camera stays as still as possible when taking video or a picture and try to get the whole body in the picture for best results. Being at least 8 feet away is recommended and it's very important to only have a single person in the video for quality results.

## How Does it Work?
### The Algorithm
We use a Convolutional Neural Network Model from Google's Tensorflow called PoseNet. This algorithm identifies 17 keypoints on the body, specifically, ankles, knees, hips, shoulders, elbows, wrists, eyes and nose. Implementation was done on Node.js to allow for dynamic use in our application.

### Example Picture from Device
<p align="center">
  <img src="https://github.com/ramos07/pose-estimation/blob/master/videos/Screen%20Shot%202020-03-30%20at%209.23.15%20AM.png" width="900" height="350" title="Example of photo from device">
</p>

### Example Video
<p align="center">
  <img src="https://github.com/ramos07/pose-estimation/blob/master/videos/final_5e26492f8d6e7d00164e69fe_535259%20(1).gif" width="300" height="250" title="Example of uMove video">
</p>

### Video Analyzation
* [Video](https://www.youtube.com/watch?v=kk0D3QOK8qk) of a gymnast being analyzed during a round-off back handspring back layout
* The graph below is made from the Example Video using MatLab which analyzes critical points in different frames of the video (Z-axis)
* The critical points represent key body positions in the tumbling sequence where corrections would be most effective

<p align="center">
  <img src="https://github.com/ramos07/pose-estimation/blob/master/videos/Screen%20Shot%202019-12-05%20at%2011.08.19%20AM.png" width="400" height="350" title="Example Graph">
  <img src="https://github.com/ramos07/pose-estimation/blob/master/videos/Screen%20Shot%202020-03-30%20at%209.18.55%20AM.png" width="800" height="450" title="Example of frames">
</p>

## Running the tests
* Jest
* Enzyme

## Built With
* AWS EC2 Container
* NGINX
* LetsEncrypt
* Node.js
* MongoDB
* React-Native

## Contributing

* Daniel Jackson Bursch
* Tajbir Sandhu
* Ricardo Ramos

## Versioning

* Version 1

## Authors

* **Daniel Jackson Bursch** - *Initial work* -


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

All the kids that showed me the fascination for learning all different kinds of fun and unique movements.

