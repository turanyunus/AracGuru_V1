import React, { Component } from 'react';
import {
    StyleSheet,
    ImageBackground, Image
} from 'react-native';

export default class Background extends Component {

    constructor(props) {
        super(props)
        this.state = { loaded: false }
    }

    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
    }

    render() {
        return (
            <ImageBackground style={ styles.imgBackground }
                    resizeMode='cover'
                    source={require('../../assets/images/background.jpg')}
                             onLoad={this._onLoad}>
                    {this.props.children}
                    {!this.state.loaded &&
                        <ImageBackground style={ styles.imgBackground }
                                         resizeMode='cover'
                                         source={require('../../assets/images/background.jpg')}>
                        </ImageBackground>
                    }
            </ImageBackground>
        );
  }
}

const styles = StyleSheet.create({
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1 
  },  
});
