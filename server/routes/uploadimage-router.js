
const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const fs = require('fs')
const Image = require('../models/image-model')

//set up express router
const router = express.Router()
router.use(bodyParser.json())

//pose folder
const poseStorage = multer.diskStorage({
  destination(req, file, callback){
    callback(null, './pose')
  },
  filename(req, file, callback){
    callback(null,  `${file.fieldname}_${Date.now()}_${file.originalname}`)
	    
  },
})

//upload folder
const Storage = multer.diskStorage({
  destination(req, file, callback){
    callback(null, './uploads')
  },
  filename(req, file, callback){
    callback(null,  `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
})

router.get('/pose', (req, res) => {
  Image.find({}, 'img createdAt', (err, img) => {
    if(err){
      res.send(err)
    }
    res.contentType('json')
    res.send(img)
	
  }).sort({createdAt: 'desc'})
})

//poseupload
const poseupload = multer({ storage: poseStorage})
//upload upload
const upload = multer({ storage: Storage})

router.get('/', (req, res) => {
  res.status(200).send('You can post to /api/pictures')
})

router.get('/posenet', (req, res) => {
  res.status(200).send('You can now upload to posenet route')
})

router.get('/', (req, res) => {
  res.status(300).send('You can post to /api/pose')
})

router.get('/posenet', (req, res) => {
  res.status(300).send('You can now upload to posenet route')
})

router.post('/pictures', upload.single('productImage'), (req, res) => {

  var imageData = fs.readFirleSync(req.file.path)

  const image = new Image({
    type: 'image/png',
    data: imageData,
  })
  try{
    image.save()
    .then(img => {
      console.log("Image has been saved!")
      console.log('file', req.file)
    })
  }catch(e){
    console.log(e)
  }

  res.status(200).json({
    message: 'Success!',
  })
  
  res.status(400).json({
    message: 'Fail!',
  })
  

})

router.post('/pose', poseupload.single('productImage'), (req, res) => {

  var imageData = fs.readFileSync(req.file.path)

  const image = new Image({
    type: 'image/png',
    data: imageData,
  })

  try{
    image.save()
    .then(img => {
      console.log("Image has been saved!")
      console.log('file', req.file)
    })
  }catch(e){
    console.log(e)
  }

  res.status(300).json({
    message: 'Success!!!!',
  })
  
  res.status(600).json({
    message: 'Fail!',
  })
  

})


module.exports = router
