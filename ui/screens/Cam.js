import React from 'react';
import { View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { withNavigationFocus } from 'react-navigation';
import CameraRoll from '@react-native-community/cameraroll';


class CamScreen extends React.Component { 
    state = {
        isRecording: false
    }
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

    recordVideo = async function () {
        if (this.camera) {
            try {
                const promise = this.camera.recordAsync({quality: RNCamera.Constants.VideoQuality["1:1"]});
        
                if (promise) {
                    this.setState({ isRecording: true });
                    const data = await promise;
                    this.setState({ isRecording: false });
                    CameraRoll.saveToCameraRoll(data.uri);
                }
            } 
            catch (e) {
                console.error(e);
            }
        }
    }
    
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
                    title={'Pic'}
                    onPress={this.takePicture.bind(this)}
                />
                <Button
                    title={'Video'}
                    onPress={this.state.isRecording ? () => {} : this.recordVideo.bind(this)}
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