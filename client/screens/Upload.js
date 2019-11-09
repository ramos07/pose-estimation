/**
 * Necessary imports.
 */
import React, {Fragment} from 'react';
import {Text, 
  View, 
  Image, 
  Button, 
  StyleSheet, 
  Platform,
  ImageBackground,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import base64 from 'react-native-base64'

import bgImage from '../images/daytime.jpg'

export default class App extends React.Component {

  /**
   * This will handle the state on wether an image has been
   * selected from our gallery.
   */
  state = {
    photo: null,
    img: '', 
  }

  clearSelectedPhoto = () => {
    this.setState({
      photo: null,
      img: '',
    })
  }

  arrayBufferToBase64(buffer){
    var binary = ''
    var bytes = [].slice.call(new Uint8Array(buffer))

    bytes.forEach((b) => binary += String.fromCharCode(b))

    var encodedImageBase64 = base64.encode(binary)

    return encodedImageBase64
  }

  /**
   * This method will handle the user selecting an 
   * image from the gallery.
   */
  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if(response.uri){
        this.setState({
          photo: response,
        })
      }
    });
  }//end of handleChoosePhoto method

  /**
   * This method will handle the users uploading a 
   * selected image from the gallery to the server.
   */
  handleUploadPhoto = () => {
    fetch('https://vietmex.me/api/posebrain', {
      method: "POST",
      headers: {
        'Accept': 'multipart/form-data',
        'Content-Type': 'multipart/form-data'
      }, 
      body: createFormData(this.state.photo, {userId: "123"})
    })
    .then((response) => response.json())
    .then(responseJson => {
      console.log("Upload successful!");
      
      var imageStr = this.arrayBufferToBase64(responseJson.binaryData.data)

      this.setState({
        photo: null,
        img: imageStr,
      });

      //console.log(this.state.img)

    })
    .catch(error => {
      console.log("Upload error!", error);
      alert(error);
    });
  }//end of handleUploadPhoto method

  render(){

    const {photo, img} = this.state;
    //const encodeImageFromServer = this.state.img;

    return(
      <ImageBackground source={bgImage} style={{flex: 1}}>
        <View style={styles.container}>
          {photo && (
            <React.Fragment>
              <Image
                source={{uri: photo.uri}}
                style={styles.selectedPhoto}
              />
              <Button title="Upload Photo" 
                      onPress={this.handleUploadPhoto}/>
            </React.Fragment>
          )}
          {img !== '' && (
            <React.Fragment>
              <Image
                source={{uri: `data:image/jpg;base64,${img}`}}
                style={styles.imageFromServer} />
            </React.Fragment>
          )}
          <Button title="Choose Photo" 
                  onPress={this.handleChoosePhoto} />
          <Button title="Clear Selected Photo"
                  onPress={this.clearSelectedPhoto} />
        </View>
      </ImageBackground>
    );
  }
} //end of render method

/**
 * Create a new form data to send our selected image 
 * information as JSON object.
 */
const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("poseImage", {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS == "android" ? photo.uri : photo.uri.replace("file://", ""),
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
}//end of createFormData method

/**
 * Styles that are used on the UI
 */
styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPhoto: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  imageFromServer: {
    width: 300,
    height: 300,
  },  
});