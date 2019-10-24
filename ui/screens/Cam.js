import React from 'react';
import { View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { withNavigationFocus } from 'react-navigation';
import CameraRoll from '@react-native-community/cameraroll';


class CamScreen extends React.Component { 
    takePicture = async function() {
        if (this.camera) {
            const options = { quality: 1, base64: true, fixOrientation: true };
            const data = await this.camera.takePictureAsync(options).then(data => {
                Alert.alert(data.uri, strings.tour_end);
                CameraRoll.saveToCameraRoll(data.uri);
            });
        }
        this.props.navigation.navigate('ConfirmPic');
    };   
    render(){
        const { isFocused } = this.props
        return(
            <View style={styles.container}>
                {isFocused 
                && 
                <RNCamera 
                    ref={ref => this.camera = ref}
                    style={styles.camera}
                    ratio={"1:1"}
                    
                />}
                <Button 
                    title={'Cap'}
                    onPress={this.takePicture.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: 'black',
        justifyContent: 'center'
    },
    camera: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
    }
})

export default withNavigationFocus(CamScreen)