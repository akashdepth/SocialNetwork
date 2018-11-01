import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import Login from './LoginScreen.js';
import HomeScreen from './HomeScreen.js';
import { AsyncStorage } from "react-native";
import * as consts from './Constants.js';
IP_ADDRESS = consts.IP_ADDRESS;


export default class MainHome extends Component {

  constructor(props){

      super(props);
      this.state = {
      isLoggedIn: false,
      userId: 0,
    };   

    this.receiveData();
        
  }
 


  
  async receiveData(){
  try {
    const userId = await AsyncStorage.getItem('userId');
    
    if (userId !== null) {
        console.log(userId);
        this.setState({userId: parseInt(userId), isLoggedIn: true,});
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {

    if (this.state.isLoggedIn) 
      return <HomeScreen
          userId={this.state.userId}
          navigation={this.props.navigation}
          onLogoutPress={() => this.setState({isLoggedIn: false})}
        />;
    else 
      return <Login 
          onLoginPress={this.receiveData.bind(this)}
        />;
    }
    }
