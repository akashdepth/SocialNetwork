import React, { Component } from 'react';
import { Text, View, StyleSheet,  ActivityIndicator} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen.js';
import CommentScreen from './CommentScreen.js';
import ImageViewer from './ImageViewer.js';
import VideoViewer from './VideoViewer.js';
import UploadHandler from './UploadHandler.js';
import FileUploader from './FileUploader.js';
import LoginScreen from './LoginScreen.js';
import MainHome from './MainHome';

const RootStack = createStackNavigator(
  {

    MainHome: {
      screen: MainHome,
          navigationOptions: {
          header: null,
      }            
    },
    LoginScreen:{
    screen: LoginScreen,
          navigationOptions: {
          header: null,
      }      
    },
    FileUploader:{
      screen: FileUploader,
          navigationOptions: {
          header: null,
        }
    },
    UploadHandler: {
        screen: UploadHandler,
        navigationOptions: {
          header: null,
        }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      }
    },

    CommentScreen: {
      screen: CommentScreen,
          navigationOptions: {
          header: null,
        }
    },

    ImageViewer: {
    	screen: ImageViewer,
        navigationOptions: {
   		    header: null,
      	}

    },
    VideoViewer: {
    	screen: VideoViewer,
    	navigationOptions: {
    		header: null,
    	}
    }

  },
  {
    initialRouteName: 'MainHome',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);


export default class App extends Component {
  render() {
    return <RootStack />;
  }
}