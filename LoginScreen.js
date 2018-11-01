import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    StyleSheet
} from 'react-native';

import { AsyncStorage } from "react-native";
import * as consts from './Constants.js';
IP_ADDRESS = consts.IP_ADDRESS;

export default class Login extends Component {

    constructor(props){
      
      super(props);

      this.state={
        mobile: '',
        userName: '',
        isValidFields: true,
        userId: 0,
      };


    }


    postData(url = ``, data = {}) {
    return fetch(url, {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(data), 
    })
    .then(response => response.json())
    .then((responseJson => {
       this.storeValue(responseJson.id);
    }))
    .catch((error)=>{
      console.log(error);
    })
    ;
}


     async storeValue(userId){
          try {
              console.log("Storing date userId"+userId);
              await AsyncStorage.setItem('userId', ''+userId);
              this.props.onLoginPress();
          } catch (error) {
              console.log(error);
          }
    }

    validate(){
      if(this.state.userName=='') return false;
      if (/^\d{10}$/.test(this.state.mobile)) {
          return true;
      } else {
          return false
      }
    }

    async handlePress(){
      var data = {
            name: this.state.userName,
            mobileNumber: this.state.mobile,
      };
      console.log(data);
      if(this.validate()){
              await this.postData(IP_ADDRESS+'/api/register_user' ,data);
      }else{
              await this.setState({isValidFields: false,});
      }
    }

    render() {
        return (
            <View style={{

                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center' }}>
                <TextInput placeholder='Mobile Number' 
                      style={{minWidth: 100,}}
                      onChangeText={(text) => this.setState({mobile: text})}
                      underlineColorAndroid = "transparent"
                      value={this.state.mobile}
                />
                <TextInput placeholder='User Name'
                      style={{minWidth: 100,}}
                      underlineColorAndroid = "transparent"
                      value={this.state.userName}
                      onChangeText={(text) => this.setState({userName: text})}
                />
                <View style={{margin:7}} />
                <Button 
                          onPress={this.handlePress.bind(this)}
                          title="Login"
                      />

                { (!this.state.isValidFields) && <Text style={{
                  color: 'red',
                }}> Invalid userName or Mobile Number</Text>}
                  </View>
            )
    }
}


const styles = StyleSheet.create({




});