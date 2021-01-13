import React, { Component } from 'react';
import {
    StyleSheet, View,
    Dimensions, Text,
    ScrollView, TouchableWithoutFeedback, Image
} from 'react-native';
import { Header} from 'react-native-elements';
import {colors} from '../common/theme';
import { Actions } from 'react-native-router-flux';

const {width, height} = Dimensions.get('window');

class AboutScreen extends Component {
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
                        centerComponent={<Text style={styles.headerTitleStyle}>Hakkımızda</Text>}
                        //rightComponent={{icon:'plus', type:'font-awesome', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{ } }}
                        outerContainerStyles={styles.headerStyle}
                        innerContainerStyles={{marginLeft:10, marginRight: 10}}
                    />
                    <Image style={styles.imageCar} source={require('./../../assets/images/car-repair-assistance.png')}/>
                    <Text style={styles.aboutText}>Mobil cihaz üzerinden 7 gün 24 saat yol yardım, bakım, onarım hizmeti almayı  ve çekici çağırmayı çok daha güvenilir,
                        çok daha kolay ve konforlu kılmak üzere tüm ekosistemi mükemmelleştirme misyonuyla çalışan AraçGuru ekibi, her geçen
                        gün yeni özelliklerle kullanıcılarının motorlu taşıtları konusunda hayatlarını kolaylaştırmayı amaçlıyor.</Text>
                    <Text style={styles.aboutText}>Motorlu taşıt sürücüleri için; 7 gün 24 saat hizmet alabilecekleri kesintisiz hizmet sunmayı amaçlayan AraçGuru ekibi,
                        Oto tamir ustaları için; geniş bir müşteri portföyü sunuyor.</Text>
                    <Text style={styles.aboutText}>Şuan sınırlı sayıda bölgede hizmet sunan ekip en kısa sürede tüm Türkiye’de hizmet sağlamaya başlayacaktır.</Text>
                    <Image style={styles.imagePhone} source={require('./../../assets/images/7-24-help.png')}/>
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
    imageCar:{
        margin: 17,
        alignSelf: 'center'
    },
    aboutText: {
        margin: 17,
        fontSize:17,
        color:colors.GREY.default,
    },
    imagePhone: {
        margin: 17,
        alignSelf: 'center'
    }
});
export  default AboutScreen;