const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Image = new Schema(
  {
    img: {data: Buffer, contentType: String} //data type is Buffer so that we can store our image as data in form of array
  },
  {timestamps: true},
)

module.exports = mongoose.model('uploads', Image)
