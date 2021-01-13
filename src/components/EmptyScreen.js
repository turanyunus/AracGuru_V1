import React, { Component } from 'react';
import {
    StyleSheet,
    View, Text, Image
} from 'react-native';
import {colors} from '../common/theme';

class EmptyScreen extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.images} source={require('./../../assets/images/filempty.png')}/>
                <Text style={styles.emptyMessage}> Aradığınız sayfamız </Text>
                <Text style={styles.emptyMessage}> bulunmamaktadır. </Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        paddingTop:30,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center'
    },
    images:{
        marginBottom:10
    },
    emptyMessage:{
        fontSize:18,
        color:colors.GREY.default,
        fontWeight:'bold'
    }
});
export default EmptyScreen;