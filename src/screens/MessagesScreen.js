import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableWithoutFeedback, Image, Platform
} from 'react-native';
import { Header} from 'react-native-elements';
import {colors} from '../common/theme';
import { Actions } from 'react-native-router-flux';
const {width, height} = Dimensions.get('window');

class MessagesScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <View style={styles.mainView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
                    <Header
                        backgroundColor={colors.GREY.default}
                        leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                        centerComponent={<Text style={styles.headerTitleStyle}>Mesajlarım</Text>}
                        rightComponent={{icon:'plus', type:'font-awesome', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{ } }}
                        outerContainerStyles={styles.headerStyle}
                        innerContainerStyles={{marginLeft:10, marginRight: 10}}
                    />
                    <View style={styles.container}>
                        <Image style={styles.images}
                               source={Platform.OS=='ios'?require('./../../assets/images/messages-icon.png'):require('./../../assets/images/messages-icon.png')}/>
                        <Text style={styles.emptyMessage}>Henüz hiç </Text>
                        <Text style={styles.emptyMessage}>mesajınız bulunmuyor ! </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontSize: 20
    },
    mainView:{
        flex:1,
        backgroundColor: colors.WHITE
    },
    scrollStyle:{
        flex: 1,
        height: height,
        backgroundColor:colors.WHITE
    },
    scrollViewStyle:{
        width: width,
        height: 50,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
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
export  default  MessagesScreen;