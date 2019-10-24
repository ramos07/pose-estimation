import React from 'react';

import {View, Text, Button, Alert} from 'react-native';

import ImagePicker from 'react-native-image-picker';

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
            <View>
                <Button 
                    title = 'Pick Image'
                    onPress = {this.HandlePickImage}
                />
            </View>
        )
    }
}