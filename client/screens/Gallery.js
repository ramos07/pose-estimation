import React, {Component} from 'react';

import {View, Text, Button, Alert, ImageBackground} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import bgImage from '../images/daytime.jpg'

export default class GalleryScreen extends React.Component {
    HandlePickImage = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                let filename = response.path.substring(response.path.lastIndexOf('/') + 1, 
                    response.path.length)
                Alert.alert(filename);
                Alert.alert(global.username);
            }
        });
    };
    
    render() {
        return(
            <ImageBackground source={bgImage} style={{flex: 1}}>
            <View>
                <Button 
                    title = 'Pick Image'
                    onPress = {this.HandlePickImage}
                />
            </View>
            </ImageBackground>
        )
    }
}