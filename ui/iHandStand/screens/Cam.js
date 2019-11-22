import React, {Component} from 'react';
import { View, Button, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { withNavigationFocus } from 'react-navigation';
import CameraRoll from '@react-native-community/cameraroll';
import { Icon, Slider } from 'react-native-elements';


class CamScreen extends React.Component { 
    state = {
        isRecording: false,
        usingCamera: true,
        currentStyle: styles.camera,
        swapIcon: 'video-camera',
        captureButtonColor: 'white',
        zoom: .99,
        flash: RNCamera.Constants.FlashMode.off,
        flashIcon: 'flash-off',
    }
    swapStyle = async function () {
        if (this.state.usingCamera == true){
            this.setState({
                currentStyle: styles.video,
                usingCamera: false,
                swapIcon: 'camera'
            })
        }
        else {
            this.setState({
                currentStyle: styles.camera,
                usingCamera: true,
                swapIcon: 'video-camera'
            })
        }
    }
    capture = async function () {
        if (this.state.usingCamera == true) {
            if (this.camera) {
                const options = { quality: 1, base64: true, fixOrientation: true };
                const data = await this.camera.takePictureAsync(options).then(data => {
                    CameraRoll.saveToCameraRoll(data.uri);
                });
            }
            this.props.navigation.navigate('ConfirmPic');
        }
        else {
            if (this.state.isRecording == true) {
                this.setState({ captureButtonColor: 'white' });
            }
            else {
                if (this.camera) {
                    try {
                        const promise = this.camera.recordAsync({quality: RNCamera.Constants.VideoQuality['1080p']});
                
                        if (promise) {
                            this.setState({ isRecording: true, captureButtonColor: 'red' });
                            const data = await promise;
                            this.setState({ isRecording: false, captureButtonColor: 'white' });
                            CameraRoll.saveToCameraRoll(data.uri);
                        }
                    } 
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }
    takePicture = async function() {
        if (this.camera) {
            const options = { quality: 1, base64: true, fixOrientation: true };
            const data = await this.camera.takePictureAsync(options).then(data => {
                CameraRoll.saveToCameraRoll(data.uri);
            });
        }
        this.props.navigation.navigate('ConfirmPic');
    };

    recordVideo = async function () {
        if (this.camera) {
            try {
                const promise = this.camera.recordAsync({quality: RNCamera.Constants.VideoQuality['1080p']});
        
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

    changeFlash = async function () {
        if (this.state.flash == RNCamera.Constants.FlashMode.off) {
            this.setState({flashIcon: 'flash', flash: RNCamera.Constants.FlashMode.on})
        }
        else if (this.state.flash == RNCamera.Constants.FlashMode.on) {
            this.setState({flashIcon: 'flash-auto', flash: RNCamera.Constants.FlashMode.auto})
        }
        else if (this.state.flash == RNCamera.Constants.FlashMode.auto) {
            this.setState({flashIcon: 'flash-off', flash: RNCamera.Constants.FlashMode.off})
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
                    style={this.state.currentStyle}
                    zoom={.99-this.state.zoom}
                    flashMode={this.state.flash}
                />}
                <Slider
                    style={styles.cameraSlider}
                    orientation='vertical'
                    value={this.state.zoom}
                    maximumValue={.99}
                    minimumValue={0}
                    onValueChange={(value) => this.setState({zoom: value})}
                    thumbTintColor='white'
                />
                <TouchableOpacity style={styles.captureButton} onPress={this.capture.bind(this)}>
                    <Icon
                        name='circle'
                        type='font-awesome'
                        color={this.state.captureButtonColor}
                        size={65}
                    />
                </TouchableOpacity>
                <View style={styles.captureButton} pointerEvents="none">
                    <Icon
                        name='circle-thin'
                        type='font-awesome'
                        color='white'
                        size={65}
                    />
                </View>
                <TouchableOpacity style={styles.swapButton} onPress={this.swapStyle.bind(this) }>
                    <Icon
                        name={this.state.swapIcon}
                        type='font-awesome'
                        color='white'
                        size={40}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.flashButton} onPress={this.changeFlash.bind(this)}>
                    <Icon
                        name={this.state.flashIcon}
                        type='material-community'
                        color='white'
                        size={40}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    camera: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width*(4/3),
    },
    video: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width*(16/9),
    },
    captureButton: {
        alignContent: "center",
        position: 'absolute', 
        bottom: 7,
    },
    swapButton: {
        position:"absolute",
        right: 10,
        bottom: 7
    },
    flashButton: {
        position:'absolute',
        right: 10,
        top: 15
    },
    cameraSlider: {
        position: 'absolute',
        right: 0,
        height: 300
    }
})

export default withNavigationFocus(CamScreen)