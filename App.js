import React, { Component } from 'react';
import { Text, View, StyleSheet,  ActivityIndicator} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen.js';
import CommentScreen from './CommentScreen.js';
import ImageViewer from './ImageViewer.js';
import VideoViewer from './VideoViewer.js';
import UploadHandler from './UploadHandler.js';
import FileUploader from './FileUploader.js';

const RootStack = createStackNavigator(
  {
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
    headerMode: 'screen' 
  }
);


export default class App extends Component {
  render() {
    return <RootStack />;
  }
}