import React from 'react';
import { Button, Image, View, Text ,StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { ImagePicker } from 'expo';

export default class UploadHandler extends React.Component {

	  constructor(props){
	  	super(props);
	  	this.state = {
		    image: null,
		    text: "",
		    extension: '',
		  };
	  }




	  _postPicture() {
				const apiUrl = 'http://192.168.0.53:8080/api/upload';
				const uri = this.state.image;
				const uriParts = uri.split('.');
				const fileType = uriParts[uriParts.length - 1];
				const formData = new FormData();

				formData.append('file', {
				  uri,
				  name: 'samplefile.'+this.state.extension,
				  type: 'image/jpg',
				});
				const options = {
				  method: 'POST',
				  body: formData,
				  headers: {
				    Accept: 'application/json',
				    'Content-Type': 'multipart/form-data',
				  },
    			};


    			function consume(stream, total = 0) {
    				console.log(stream);

					  // while (stream.state === "readable") {
					  //   var data = stream.read()
					  //   total += data.byteLength;
					  //   console.log("received " + data.byteLength + " bytes (" + total + " bytes in total).")
					  // }
					  // if (stream.state === "waiting") {
					  //   stream.ready.then(() => consume(stream, total))
					  // }
					  // return stream.closed
				}
    			 fetch(apiUrl, options).then(res => consume(res))
				  .then(() => console.log("consumed the entire body without keeping the whole thing in memory!"))
				  .catch((e) => console.error("something went wrong", e));
    		}

	 _renderImage(){
 	          if(this.state.image){
	          	 return (<Image source={{ uri: this.state.image }} style={styles.imageStyle} />);
          		
          }else{
          		return (<Image source={require('./assets/images/uploadicon.png')} style={styles.imageStyle}/>);
      		}
 		}

  render() {

    return (

    <View style={styles.contentContainer}>

    <View style={{
	   		width: 320,
	   		height: 200,
	   		marginLeft: 20,
	   		marginRight: 20,
	   		backgroundColor: 'white',
	   		marginTop: 50,
	   		marginBottom: 10,
	   		borderRadius: 25
   		}}>
       
       <TextInput
        		style={{
        			textAlign: 'center',
        			top: 80,
        			fontSize: 30,

        		}}
                underlineColorAndroid = "transparent"
                placeholder = "What's in your mind?"
                placeholderTextColor = "black"
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
      />
      </View>

      <View style={{
      	marginLeft: 20,
      	marginRight: 20, 
      }}>
    	<TouchableOpacity
    		onPress={this._pickImage}
    	>
    	{
      		this._renderImage()
		}
  		</TouchableOpacity>

       </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Post"
          onPress={this._postPicture.bind(this)}
        />
      </View>

      </View>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: "All",
    });

    var re = /(?:\.([^.]+))?$/;
	var ext = re.exec(result.uri)[1];   // "txt"
	console.log(ext);
	console.log(result.uri);
    if (!result.cancelled) {
      this.setState({ 
      	image: result.uri, 
      	height: result.height, 
      	width: result.width,
      	extension:  ext});
    }
  };
}



const styles = StyleSheet.create({

  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'gray'
  },
  fotter:{
	justifyContent: 'space-between',
	flexDirection: 'row',
	height: 35,
	alignSelf: 'center',
	backgroundColor: 'blue',
	},
	imageStyle: {
		width: 300, height: 300,borderRadius: 25, alignSelf: 'center',
	}
});
