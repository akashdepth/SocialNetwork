import React, { Component,PureComponent} from 'react';
import {  View,StyleSheet, Dimensions,Image,ActivityIndicator} from 'react-native';



export default class ImageViewer extends Component{

	constructor(props){
		super(props);
		this.state={
			width: 100,
			height: 100,
			uri: 'https://1.img-dpreview.com/files/p/TS1200x900~sample_galleries/4465348876/2284269311.jpg'
		};

	}


	componentDidMount() {
		const { navigation } = this.props;
		const uri_const = navigation.getParam('url', '');
	    Image.getSize(uri_const, (srcWidth, srcHeight) => {
	      const maxHeight = Dimensions.get('window').height; // or something else
	      const maxWidth = Dimensions.get('window').width;

	      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	      this.setState({ width: srcWidth * ratio, height: srcHeight * ratio, url: uri_const });
	    }, error => {
	      console.log('error:', error);
	    });

	    console.log(this.state);
	  }
	  render() {
	  		console.log(this.state);
	        return (
	        	<View style={styles.container}>
                <Image 
	                style={{ 
		                	width: this.state.width, 
		                	height: this.state.height,
	                	}}
					 resizeMode="stretch"
	                 source={{uri : this.state.url}}/> 
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
    }
});