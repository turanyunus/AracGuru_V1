import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import {colors} from "../common/theme";

export default class Notifications extends React.Component {

    constructor(props){
        super(props);
        this.state={

        } 
      }

    render(){    
    return(
        <View style={styles.container}>
            <Image style={styles.images} source={require('./../../assets/images/notification-disable.png')}/>
            <Text style={styles.emptyMessage}>Henüz hiç</Text>
            <Text style={styles.emptyMessage}>bildirimiz bulunmuyor !</Text>
        </View>
    ); 
}
};
const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        paddingTop:80,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center'
    },
    images:{
        marginBottom:15,
    },
    emptyMessage:{
        fontSize:16,
        color:colors.GREY.default,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        fontWeight: 'bold'
    }

});