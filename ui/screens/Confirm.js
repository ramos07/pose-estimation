import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

export default class ConfirmScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            code: '',
        }
    }
    handleConfirmation = () => {
        const {email, code} = this.state;
        Auth.confirmSignUp(email, code, {})
        this.props.navigation.navigate('Login');
    }
    render(){
        return(
            <View style = {styles.container}>
                <Input
                    label = 'Email'
                    leftIcon = {{type: 'ionicon', name: 'md-mail', color: 'grey'}}
                    placeholder = 'Enter Email'
                    onChangeText = {
                        (email) => this.setState({email})
                    }
                />
                <Input
                    label = 'Confirmation Code'
                    leftIcon = {{type: 'ionicon', name: 'md-lock', color: 'grey'}}
                    placeholder = 'Enter Code'
                    onChangeText = {
                        (code) => this.setState({code})
                    }
                />
                <Button
                    title="Sign up"
                    onPress={
                        this.handleConfirmation
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
})