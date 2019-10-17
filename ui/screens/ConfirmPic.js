import React from 'react'

import {Button, View, Text} from 'react-native'

export default class ConfirmPicScreen extends React.Component {
    HandleConfirm = () =>{
        this.props.navigation.navigate('Cam')
    }
    HandleRetake = () =>{
        this.props.navigation.navigate('Cam')
    }
    render(){
        return(
            <View>
                <Text>Picture Confirmation Screen</Text>
                <Button
                    title = 'Confirm'
                    onPress = {this.HandleConfirm}
                />
                <Button
                    title = 'Retake'
                    onPress = {this.HandleRetake}
                />
            </View>
        )
    }
}