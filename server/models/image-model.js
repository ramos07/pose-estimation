//database that creates the schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://127.0.0.1:27017/cinema')

const Image = new Schema(
  {
    img: {data: Buffer, contentType: String} //data type is Buffer so that we can store our image as data in form of array
  },
  {timestamps: true},
)

const PImage = new Schema(
  {
    img: {data: Buffer, contentType: String} //data type is Buffer so that we can store our image as data in form of array
  },
  {timestamps: true},
)
module.exports = mongoose.model('uploads', Image)
module.exports = mongoose.model('pose', PImage)
