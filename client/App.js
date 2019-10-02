/**
 * Necessary imports.
 */
import React, {Fragment} from 'react';
import {Text, View, Image, Button, StyleSheet, Platform, ImageBackground} from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default class App extends React.Component {
  constructor(props){
    super(props);
    /**
     * This will handle the state on whether an image has been
     * selected from our gallery.
     */
    this.state = {
      photo: null,
    }
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
          photo: response
        })
      }
    });
  }//end of handleChoosePhoto method

  /**
   * This method will handle the users uploading a
   * selected image from the gallery to the server.
   */
  handleUploadPhoto = () => {
    fetch("http://100.25.75.187:3000/api/pictures", {
      method: "POST",
      body: createFormData(this.state.photo, {userId: "123"})
    })
    .then(response => response.json())
    .then(response => {
      console.log("Upload successful!");
      alert("Upload successful!");
      this.setState({
        photo: null,
      });
    })
    .catch(error => {
      console.log("Upload error!", error);
      alert(error);
    });
  }//end of handleUploadPhoto method

  cancelPhoto = () => {
    this.setState({
      photo: null,
    });
  }

  render(){
    const {photo} = this.state;
    return(
       <ImageBackground source={{uri:'https://wallpaperplay.com/walls/full/6/7/9/228147.jpg'}} style={{width: '100%', height: '100%'}}>
          <View style={styles.container}>
            {photo && (
              <React.Fragment>
              <View style= {styles.cancelPhoto}>
                <Button color="#588fb6" title="X" onPress={this.cancelPhoto}/>
                </View>
                <Image
                  source={{uri: photo.uri}}
                  style={styles.selectedPhoto}
                />
                <View style={styles.buttonFormat}>
                  <Button color="#588fb6" title="Upload Photo" onPress={this.handleUploadPhoto} />
                </View>
              </React.Fragment>
            )}
            <View style={styles.buttonFormat}>
            <Button color="#588fb6" title="Choose Photo" onPress={this.handleChoosePhoto} />
            </View>
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

  data.append("productImage", {
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

  cancelButton:{
    width:10,
    height:10,
    justifyContent:"flex-end"
  },

  buttonFormat:{
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  selectedPhoto: {
    marginBottom: 30,
    width: 300,
    height: 300,
  },


});
