import React, {PureComponent} from 'react';
import { Text, View, StyleSheet, Image,ActivityIndicator,TouchableOpacity} from 'react-native';



export default class BottomBar extends PureComponent{

   constructor(props){
    super(props);
    this.state = {
      noOfShares: this.props.input.noOfShares,
      noOfComment: this.props.input.noOfComment,
      noOfLikes: this.props.input.noOfLikes,
      likeStatus: this.props.input.likeStatus,
    };
}


  getApiData(which, what){
    return fetch('http://192.168.0.53:8080/api/increase/'+which+'/'+what+'/'+this.props.input.id)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          noOfShares:  responseJson.shares,
          noOfComment: responseJson.noOfComment,
          noOfLikes:   responseJson.likes,
          likeStatus:  responseJson.likeStatus,
        });
      })
      .catch((error) =>{
        console.log("Got Network Error.");
        console.error(error);
      });
  }

    _handleShare(){
          this.getApiData("share","add");
    }

    _handleLike(){
      console.log(this.state);
      if(this.state.likeStatus){
          this.getApiData("like","del");
      }
      else{
          this.getApiData("like","add");
      }
    }

    _handleComment(){
          this.getApiData("comment","add");
    }

    render(){
      return (
         <View style={styles.actionbar}>
            <TouchableOpacity style={styles.shareContainer} onPress={this._handleShare.bind(this)}>
              <View style={styles.infobar}>
                <Image style={{width: 15, height: 15}} source={require('./assets/images/whatsapp.png')}/> 
                <Text style={[styles.infoContainerFonts]}>{this.state.noOfShares}</Text>
              </View>              
              <Text style={[styles.actionContainerFonts]}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeContainer} onPress={this._handleLike.bind(this)}>
              <View style={styles.infobar} >
                <Image style={{width: 15, height: 15}} source={require('./assets/images/likeicon.png')}/> 
                <Text style={[styles.infoContainerFonts]}>{this.state.noOfLikes}</Text>
              </View>
                <Text style={[styles.actionContainerFonts]}>Like</Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.commentsContainer} onPress={this._handleComment.bind(this)}>
            <View style={styles.infobar}>
               <Image style={{width: 15, height: 15, marginLeft: 5}} source={require('./assets/images/comment.png')}/> 
               <Text style={[styles.infoContainerFonts]}>{this.state.noOfComment}</Text>
            </View>
               <Text style={[styles.actionContainerFonts]}>Comment</Text>
            </TouchableOpacity>
         </View>
        );

    }

  }


const styles = StyleSheet.create({
  timeStyle: {
    color: '#A4A4A4',
    fontSize: 10
  },
  header: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,  
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
  small_head: {
    marginLeft: 4
  },
  usernameStyle: {
    fontWeight: 'bold',
  },
  headTextStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10
  },
  scrolStyle: {
      backgroundColor: '#b6bdc6'
  },
  topContainer: {
    alignContent: "space-between",
    marginTop: 20,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10
  },
  
  infobar: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
  },

 infoIcons: {
  marginTop: 3,
  marginLeft: 3,
  width: 8,
  height: 8
 },

 actionbar: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-end",
        marginTop: 5,
        marginBottom: 5

  },

  contentContainer: {
    paddingVertical: 10
  },
  likeContainer: {
    flex: 1,
    width: 50,
    marginLeft: 19
  },
  shareContainer: {
    width: 100, 
    marginLeft: 10,
  },
  commentsContainer: {
    flex: 1,
    width: 50,
    marginRight: 10,
  },
   likeInfoContainer: {
    width: 100, 
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
  },
  shareInfoContainer: {
    width: 100, 
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
  },
  commentsInfoContainer: {
    width: 100, 
    marginLeft: 20,
    flex: 1,
    flexDirection: "row",
  },
   infoContainerFonts: {
    fontSize: 10,
    color: '#A4A4A4',
    fontWeight: 'bold',
    flexWrap: "nowrap",
    marginLeft: 3
  },
 
  actionContainerFonts: {
    fontSize: 10,
    color: 'gray',
  }
});