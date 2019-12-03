const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const fs = require('fs')
const Image = require('../models/image-model')

const router = express.Router()

router.use(bodyParser.json())

const Storage = multer.diskStorage({
  destination(req, file, callback){
    callback(null, './uploads')
  },
  filename(req, file, callback){
    callback(null,  `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage: Storage})

router.get('/', (req, res) => {
  res.status(200).send('You can post to /api/pictures')
})

router.get('/pictures', (req, res) => {
  Image.find({}, 'img createdAt', (err, img) => {
    if(err){
      res.send(err)
    }
    console.log(img)
    res.contentType('json')
    res.send(img)
  }).sort({createdAt: 'desc'})
})

router.post('/pictures', upload.single('productImage'), (req, res) => {

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

  res.status(200).json({
    message: 'Success!',
    data: req.file.path,    
  })
})



module.exports = router