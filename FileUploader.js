'use strict';
 
import React, { Component,PureComponent} from 'react';
import { ImagePicker } from 'expo';
import { Text,Button,  View,TextInput, TouchableOpacity,ImageBackground, StyleSheet, Image,ActivityIndicator} from 'react-native';
import { create } from 'apisauce'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const IP_ADDRESS='http://192.168.0.53:8080';

const api = create({
    baseURL: IP_ADDRESS,
  });

// class LogoTitle extends React.Component {
//   render() {
//     return (
//       <Text>
//         Akash Chaudhary
//       </Text>
//     );
//   }
// }


export default class FileUploader extends Component {

  static navigationOptions = {
    // headerTitle: <LogoTitle />,
  };


componentDidMount() {
  this.props.navigation.setParams({
      text: '',
      uri: '',
      extension: '',
      height: '',
      width: '',
      uploading: true,
      progress: 0,

    });
  }


  constructor(props) {
    super(props);
    console.log(this.props);
    const { navigation } = this.props;
    const _userId = navigation.getParam('userId', '0');

    this.state={
      text: '',
      uri: '',
      extension: '',
      height: '',
      width: '',
      uploading: false,
      progress: 0,
      fileName: '',
      userId: _userId,
    };
  }


_postData(){
          const data = new FormData();
          data.append('file', {
                  uri: this.state.uri,
                  type: 'image/jpeg',
                  name: 'u-'+this.state.userId+'.' + this.state.extension
          });
        api.post('/api/upload', data, {
              onUploadProgress: (e) => {
                const progress = e.loaded / e.total;
                console.log(progress);
                this.setState({
                  progress: progress*100,
                  uploading: true,
                });
              }
            })
              .then((res) =>{
                this.setState({
                  uploading: false,
                  fileName: res.data.fileName,
                  lightFileName: res.data.lightFileName,
                  size: res.data.size,
                });
                console.log(res.data);
              });
}


_addContentSection(){

  var contentType = 'image';
  if(['mp4', 'mov', 'wmv', 'flv', 'avi'].indexOf(this.state.extension)>-1){
    contentType = 'video';
  }else if(this.state.fileName==''){
    contentType = 'text';
  }
  var data = {
              title: 'None',
              userId: this.state.userId,
              noOfShares: 0,
              noOfLikes: 0,
              noOfComment: 0,
              language: 'English',
              contentType: contentType,
              url: this.state.fileName,
              lightWeightUrl: this.state.lightFileName,
              about: this.state.text,
              likeStatus: false,


    };
    this.postData(IP_ADDRESS+'/api/add_content_section', data);
    this.setState({
      text: '',
      uri: '',
      extension: '',
      height: '',
      width: '',
      uploading: true,
      progress: 0,
      lightFileName: '',
      url: '',
    });
    alert("Successfully posted.");
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
      console.log(responseJson);
    }))
    .catch((error)=>{
      console.log(error);
    })
    ;
}

 _addImage = async () => {

    this.setState({
      progress: 0,
    });

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: "Images",
    });

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(result.uri)[1];   // "txt"
    if (!result.cancelled) {
      this.setState({ 
        uri: result.uri, 
        height: result.height, 
        width: result.width,
        extension:  ext});
      }
       this._postData();

  }

 _addVideo = async () => {

    this.setState({
      progress: 0,
    });

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: "Videos",
    });

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(result.uri)[1];   // "txt"
    if (!result.cancelled && this.state.uri!=result.uri) {
      this.setState({ 
        uri: result.uri, 
        height: result.height, 
        width: result.width,
        extension:  ext});
      this._postData();
    }else{
      this.setState({ 
        progress: 100,
      });
    }

  }



   _renderImage(){
            if(this.state.uri){
               return (<Image source={{ uri: this.state.uri }} style={styles.imageStyle} />);
              
          }else{
              return (<Image source={require('./assets/images/uploadicon.png')} style={styles.imageStyle}/>);
          }
    }


  render() {


    return (



    <View style={styles.contentContainer}>

    <View style={{
        marginRight: 10,
        marginTop: 50,
        marginLeft: 10,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: 'green'
      }}>
      <Button
        onPress={() => {
            if(this.state.text==''){
                alert("Please write something..");
            }
            else if(this.state.uploading){
              alert("Please wait file is uploading....");
            }
            else{
              this._addContentSection();
            }
        }}
        title="Post"
        color="transparent"
      />
      </View>


        <View style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: 'white',
            borderRadius: 25,
            marginBottom: 10,
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
                onChangeText={(_text) => {
                  this.setState({text: _text});
              }}
                value={this.state.text}
      />
      </View>

    {this.state.uri != '' &&
     <View style={{
            flex: 1,
            marginBottom: 65,
            alignSelf: 'center'
     }}>
      <AnimatedCircularProgress
        size={250}
        width={3}
        fill={this.state.progress}
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {
          (fill) => (
            <Image source={{uri: this.state.uri}} style={[{
              backgroundColor: 'transparent',
              position: 'absolute',
              width: 241,
              height: 241,
              borderRadius: 120
            }]}/>
          )
        }
      </AnimatedCircularProgress>
      </View>
    }



        <View style={styles.fotter}>
            <TouchableOpacity style={styles.bottomBar}
              onPress={this._addImage}
            >
              <Image source={require('./assets/images/imageicon.png')} style={styles.imageFotter}/>
              <Text style={styles.textFotter}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBar}
              onPress={this._addVideo}
            >
              <Image source={require('./assets/images/videoicon.png')} style={styles.imageFotter}/>
              <Text style={styles.textFotter}>Video</Text>

            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.bottomBar}>
                  <Image source={require('./assets/images/cameraicon.png')} style={styles.imageFotter}/>
                  <Text style={styles.textFotter}>Camera</Text>
              </View>

            </TouchableOpacity>
        </View>
      </View>
    );
  }
}




const styles = StyleSheet.create({
  textFotter: {
    fontSize: 15,
    fontWeight: "600",
    color: 'gray'
  },
  imageFotter: {
    width: 40, 
    height: 40, 
    borderRadius: 20
  },
  bottomBar: {
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'gray'
  },

  fotter: {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
  },
  imageStyle: {
    width: 300, height: 300,borderRadius: 25, alignSelf: 'center',
  },
  points: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 72,
    left: 56,
    width: 90,
    textAlign: 'center',
    color: '#7591af',
    fontSize: 50,
    fontWeight: "100"
  },
});


