import React from 'react';
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Asset, Audio, Font, Video } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {
  PlayIcon,
  PauseIcon,
  Spinner,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  ReplayIcon,
} from './assets/icons';


class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

var PLAYBACK_STATES = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  BUFFERING: 'BUFFERING',
  ERROR: 'ERROR',
  ENDED: 'ENDED',
};


var SEEK_STATES = {
  NOT_SEEKING: 'NOT_SEEKING',
  SEEKING: 'SEEKING',
  SEEKED: 'SEEKED',
};

var CONTROL_STATES = {
  SHOWN: 'SHOWN',
  SHOWING: 'SHOWING',
  HIDDEN: 'HIDDEN',
  HIDING: 'HIDDING',
};

const TRACK_IMAGE = require('./assets/images/track.png');
const THUMB_IMAGE = require('./assets/images/thumb.png');


const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ALL = 0;
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFF8ED';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = '... loading ...';
const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;

export default class VideoPlayer extends React.Component {

 static propTypes = {
    /**
     * How long should the fadeIn animation for the controls run? (in milliseconds)
     * Default value is 200.
     *
     */
    fadeInDuration: PropTypes.number,
    /**
     * How long should the fadeOut animation run? (in milliseconds)
     * Default value is 1000.
     *
     */
    fadeOutDuration: PropTypes.number,
    /**
     * How long should the fadeOut animation run when the screen is tapped when the controls are visible? (in milliseconds)
     * Default value is 200.
     *
     */
    quickFadeOutDuration: PropTypes.number,
    /**
     * If the user has not interacted with the controls, how long should the controls stay visible? (in milliseconds)
     * Default value is 4000.
     *
     */
    hideControlsTimerDuration: PropTypes.number,

    /**
     * Callback that gets passed `playbackStatus` objects for the underlying video element
     */
    playbackCallback: PropTypes.func,

    /**
     * Error callback (lots of errors are non-fatal and the video will continue to play)
     */
    errorCallback: PropTypes.func,

    // Icons
    playIcon: PropTypes.func,
    pauseIcon: PropTypes.func,
    spinner: PropTypes.func,
    fullscreenEnterIcon: PropTypes.func,
    fullscreenExitIcon: PropTypes.func,

    showFullscreenButton: PropTypes.bool,

    /**
     * Style to use for the all the text in the videoplayer including seek bar times and error messages
     */
    textStyle: PropTypes.object,

    /**
     * Props to use into the underlying <Video>. Useful for configuring autoplay, playback speed, and other Video properties.
     * See Expo documentation on <Video>. `source` is required.
     */
    videoProps: PropTypes.object,

    /**
     * Write internal logs to console
     */
    debug: PropTypes.bool,

    // Dealing with fullscreen
    isPortrait: PropTypes.bool,
    switchToLandscape: PropTypes.func,
    switchToPortrait: PropTypes.func,

    showControlsOnLoad: PropTypes.bool,
  };

  static defaultProps = {
    // Animations
    fadeInDuration: 200,
    fadeOutDuration: 1000,
    quickFadeOutDuration: 200,
    hideControlsTimerDuration: 4000,
    // Appearance (assets and styles)
    playIcon: PlayIcon,
    pauseIcon: PauseIcon,
    spinner: Spinner,
    fullscreenEnterIcon: FullscreenEnterIcon,
    fullscreenExitIcon: FullscreenExitIcon,
    showFullscreenButton: true,
    replayIcon: ReplayIcon,
    trackImage: TRACK_IMAGE,
    thumbImage: THUMB_IMAGE,
    textStyle: {
      color: '#FFFFFF',
      fontSize: 12,
    },
    // Callbacks
    playbackCallback: () => {},
    errorCallback: error => {
      console.log('Error: ', error.message, error.type, error.obj);
    },
    debug: false,
    switchToLandscape: () => {
      console.warn(
        'Pass in this function `switchToLandscape` in props to enable fullscreening'
      );
    },
    switchToPortrait: () => {
      console.warn(
        'Pass in this function `switchToLandscape` in props to enable fullscreening'
      );
    },
    showControlsOnLoad: false,
  };


  constructor(props) {
    super(props);
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.state = {
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ONE,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: true,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
      poster: false,
      useNativeControls: false,
      fullscreen: false,
      throughEarpiece: false,
      playbackState: PLAYBACK_STATES.LOADING
    };

    setInterval( ()=>{
      this._onPlayPausePressed(this.props.isPlaying);
    }  , 100);
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    (async () => {
      await Font.loadAsync({
        ...MaterialIcons.font,
        'cutive-mono-regular': require('./assets/fonts/CutiveMono-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
  }

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    const source = { uri: this.props.uri };
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: this.state.volume,
      isMuted: this.state.muted,
      isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
    };

    try{
      if (this.props.isVideo) {
        this._video.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        await this._video.loadAsync(source, initialStatus);
        this.playbackInstance = this._video;
        const status = await this._video.getStatusAsync();
      } else {
        const { sound, status } = await Audio.Sound.create(
          source,
          initialStatus,
          this._onPlaybackStatusUpdate
        );
        this.playbackInstance = sound;
      }
    this._updateScreenForLoading(false);
  }catch(e){
      console.log(e);
  }

  }

  _mountVideo = component => {
    this._video = component;
    this._loadNewPlaybackInstance(false);
  };

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        showVideo: this.props.isVideo,
        isLoading: false,
      });
    }
  }



  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && !status.isLooping) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }    
  };

    _onPlayPausePressed(requestPlayingStatus) {
        if (this.playbackInstance != null) {
          if (this.state.isPlaying && !requestPlayingStatus) {
            this.playbackInstance.pauseAsync();
          } else if(!this.state.isPlaying && requestPlayingStatus){
            this.playbackInstance.playAsync();
          }
        }
      }


  _onReadyForDisplay = event => {
    const widestHeight = DEVICE_WIDTH * event.naturalSize.height / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      this.setState({
        videoWidth: VIDEO_CONTAINER_HEIGHT * event.naturalSize.width / event.naturalSize.height,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      });
    } else {
      this.setState({
        videoWidth: DEVICE_WIDTH,
        videoHeight: DEVICE_WIDTH * event.naturalSize.height / event.naturalSize.width,
      });
    }
  };
  
  _changeVideoPosition = () =>{
         this._onPlayPausePressed(!this.props.isPlaying);
         this.props.callback(!this.props.isPlaying);
  };


  _onSliderLayout = evt => {
    this.setState({ sliderWidth: evt.nativeEvent.layout.width });
  };


   _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }


  _getSeekSliderPosition() {

    if (
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }


  _setSeekState(seekState) {
    this.props.debug &&
      console.log(
        '[seek]',
        this.state.seekState,
        ' -> ',
        seekState,
        ' [playback] ',
        this.state.playbackState,
        ' [shouldPlay] ',
        this.state.shouldPlay
      );

    this.setState({ seekState });

    if (seekState === SEEK_STATES.SEEKING) {
      this.controlsTimer && this.clearTimeout(this.controlsTimer);
    } else {
      this._resetControlsTimer();
    }
  }

  _togglePlay() {
    this.state.playbackState == PLAYBACK_STATES.PLAYING
      ? this._playbackInstance.setStatusAsync({ shouldPlay: false })
      : this._playbackInstance.setStatusAsync({ shouldPlay: true });
  }

  _toggleControls = () => {
    switch (this.state.controlsState) {
      case CONTROL_STATES.SHOWN:
        // If the controls are currently shown, a tap should hide controls quickly
        this.setState({ controlsState: CONTROL_STATES.HIDING });
        this._hideControls(false);
        break;
      case CONTROL_STATES.HIDDEN:
        // If the controls are currently, show controls with fade-in animation
        this._showControls();
        this.setState({ controlsState: CONTROL_STATES.SHOWING });
        break;
      case CONTROL_STATES.HIDING:
        // If controls are fading out, a tap should reverse, and show controls
        this.setState({ controlsState: CONTROL_STATES.SHOWING });
        this._showControls();
        break;
      case CONTROL_STATES.SHOWING:
        // A tap when the controls are fading in should do nothing
        break;
    }
  };

  _showControls = () => {
    this.showingAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 1,
      duration: this.props.fadeInDuration,
      useNativeDriver: true,
    });

    this.showingAnimation.start(({ finished }) => {
      if (finished) {
        this.setState({ controlsState: CONTROL_STATES.SHOWN });
        this._resetControlsTimer();
      }
    });
  };

  _hideControls = (immediate = false) => {
    if (this.controlsTimer) {
      this.clearTimeout(this.controlsTimer);
    }
    this.hideAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 0,
      duration: immediate
        ? this.props.quickFadeOutDuration
        : this.props.fadeOutDuration,
      useNativeDriver: true,
    });
    this.hideAnimation.start(({ finished }) => {
      if (finished) {
        this.setState({ controlsState: CONTROL_STATES.HIDDEN });
      }
    });
  };

  _onTimerDone = () => {
    // After the controls timer runs out, fade away the controls slowly
    this.setState({ controlsState: CONTROL_STATES.HIDING });
    this._hideControls();
  };



  _resetControlsTimer = () => {
    if (this.controlsTimer) {
      this.clearTimeout(this.controlsTimer);
    }
    // this.controlsTimer = this.setTimeout(
    //   this._onTimerDone.bind(this),
    //   this.props.hideControlsTimerDuration
    // );
  };

 _onSeekBarTap = evt => {
    if (
true    ) {
      const value = evt.nativeEvent.locationX / this.state.sliderWidth;
      this._onSeekSliderValueChange();
      this._onSeekSliderSlidingComplete(value);
    }
  };
  _onSeekSliderValueChange = () => {
    if (    
      this.state.seekState !== SEEK_STATES.SEEKING
    ) {
      this._setSeekState(SEEK_STATES.SEEKING);
      // A seek might have finished (SEEKED) but since we are not in NOT_SEEKING yet, the `shouldPlay` flag
      // is still false, but we really want it be the stored value from before the previous seek
      this.shouldPlayAtEndOfSeek =
        this.state.seekState === SEEK_STATES.SEEKED
          ? this.shouldPlayAtEndOfSeek
          : this.state.shouldPlay;
      // Pause the video
      this.playbackInstance.setStatusAsync({ shouldPlay: false });
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.playbackInstance != null) {
      // Seeking is done, so go to SEEKED, and set playbackState to BUFFERING
      this._setSeekState(SEEK_STATES.SEEKED);
      // If the video is going to play after seek, the user expects a spinner.
      // Otherwise, the user expects the play button
      // this._setPlaybackState(
      //   this.shouldPlayAtEndOfSeek
      //     ? PLAYBACK_STATES.BUFFERING
      //     : PLAYBACK_STATES.PAUSED
      // );
      this.playbackInstance
        .setStatusAsync({
          positionMillis: value * this.state.playbackInstanceDuration,
          shouldPlay: this.shouldPlayAtEndOfSeek,
        })
        .then(playbackStatus => {
          // The underlying <Video> has successfully updated playback position
          // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to PAUSED?
          // But because we setStatusAsync(shouldPlay: false), so the playbackStatus return value will be PAUSED.
          this._setSeekState(SEEK_STATES.NOT_SEEKING);
          this._setPlaybackState(
            this._isPlayingOrBufferingOrPaused(playbackStatus)
          );
        })
        .catch(message => {
          this.props.debug && console.log('Seek error: ', message);
        });
    }
  };

  render() {
    return (
      <View>
      <TouchableOpacity style={styles.container} onPress={this._changeVideoPosition}>
          <Video
            ref={this._mountVideo}
            style={[
              styles.video,
              {
                opacity: this.state.showVideo ? 1.0 : 0.0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
              },
            ]}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onError={this._onError}
            onFullscreenUpdate={this._onFullscreenUpdate}
            onReadyForDisplay={this._onReadyForDisplay}
            useNativeControls={this.state.useNativeControls}
          />
          </TouchableOpacity>

          <View style={{flex:1, flexDirection: 'row'}}>
            <Text
              style={[
                { backgroundColor: 'transparent',marginTop: 1.5, marginLeft:5,fontSize: 10},
              ]}>
              {this._getMMSSFromMillis(this.state.playbackInstancePosition)}
            </Text>

                    <TouchableWithoutFeedback
                        onLayout={this._onSliderLayout.bind(this)}
                        onPress={this._onSeekBarTap.bind(this)}>
                        <Slider
                          style={{flex: 1, }}
                          trackImage={this.props.tackImage}
                          thumbImage={this.props.thumbImage}
                          value={this._getSeekSliderPosition()}
                          onValueChange={this._onSeekSliderValueChange}
                          onSlidingComplete={this._onSeekSliderSlidingComplete}
                          disabled={false}
                        />
                        </TouchableWithoutFeedback>
                        {/* Duration display */}
                      <Text
                        style={[
                          { backgroundColor: 'transparent', marginRight: 5,marginTop: 1.5, fontSize: 10 },
                        ]}>
                        {this._getMMSSFromMillis(this.state.playbackInstanceDuration)}
                      </Text>

                      </View>
              </View>



      );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {

    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  video: {
    maxWidth: DEVICE_WIDTH,
  },
});