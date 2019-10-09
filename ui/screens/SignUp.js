import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import Dialog from 'react-native-dialog'

export default class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirm: '',
        }
    }
    handleSignUp = () => {
        const {email, password, confirm} = this.state;
        if (password == confirm) {
            Auth.signUp({username: email, password: password, attributes: { email }, })
        }
        this.props.navigation.navigate('Login');
    }
    handleConfirmation = () => {
        const {email, password, confirm} = this.state;
        Auth.confirmSignUp({email, confirm})
        this.setState({visible: false})
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
                    label = 'Password'
                    leftIcon = {{type: 'ionicon', name: 'md-lock', color: 'grey'}}
                    placeholder = 'Enter Password'
                    onChangeText = {
                        (password) => this.setState({password})
                    }
                />
                <Input
                    label = 'Confirm Password'
                    leftIcon = {{type: 'ionicon', name: 'md-lock', color: 'grey'}}
                    placeholder = 'Re-Enter Password'
                    onChangeText = {
                        (confirm) => this.setState({confirm})
                    }
                />
                <Button
                    title="Sign up"
                    onPress={
                        this.handleSignUp
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