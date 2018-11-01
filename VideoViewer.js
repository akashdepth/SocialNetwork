import React, { Component,PureComponent} from 'react';
import {  View,StyleSheet, Dimensions,Image,ActivityIndicator} from 'react-native';
import {Video } from 'expo';
import VideoPlayer from './VideoPlayer.js';


export default class VideoViewer extends Component{

	constructor(props){
		super(props);
		this.state={
			width: 100,
			height: 100,
			uri: ''
		};
	}


	componentDidMount() {
		const { navigation } = this.props;
		const uri_const = navigation.getParam('url', '');
	      const maxHeight = Dimensions.get('window').height; 
	      const maxWidth = Dimensions.get('window').width;

	      this.setState({ width: maxWidth, height: maxHeight/2, url: uri_const });

  	    console.log(this.state);
	  }
	  render() {
	        return (
	        	<View style={styles.container}>
	        	<Video
					  source={{ uri: this.state.url }}
					  rate={1.0}
					  volume={1.0}
					  isMuted={false}
					  resizeMode="cover"
					  shouldPlay
					  isLooping
					  style={{ width: this.state.width, height: this.state.height }}
					  useNativeControls={true}
				/>
				</View>
		          );
	    }

}

const styles = StyleSheet.create({
    container: {
    	flex: 1, 
    	alignItems: 'center',
	    justifyContent: 'center', 
    	backgroundColor: 'black',
    	justifyContent: 'center',
    },
	video: {
	    maxWidth: 100,
	  },
});