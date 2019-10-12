import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Auth } from 'aws-amplify';

export default class HomeScreen extends React.Component {
    async componentDidMount(){
        const user = await Auth.currentAuthenticatedUser()
        console.log('user: ', user)
    }
    render(){
        return(
            <View>
            </View>
        )
    }
}