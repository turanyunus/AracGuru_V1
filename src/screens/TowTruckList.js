import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    Dimensions,
    FlatList,
    Platform
} from 'react-native';
import {Icon} from "react-native-elements";
import {connect} from "react-redux";
import {fetchTowTruck} from "../actions";
import {Actions} from "react-native-router-flux";
import {formatPhoneNumber} from "../common/functionCommon";
import {colors} from "../common/theme";

const {height} = Dimensions.get('window');

class TowTruckList extends Component {

    componentDidMount(){
        const { localarea } = this.props;
        this.props.fetchTowTruck(localarea.province, localarea.district);
    }

    renderItem = ({ item }) => (
        <TouchableOpacity style={styles.cartClickArea}
                          key={item.autoservice_ID}
                          onPress={()=> {
                              Actions.TowTruckDetail({
                                  towService: item
                              })
                          }}>
            <View style={styles.cartLogo}>
                <Image source={Platform.OS=='ios'?require('../../assets/images/tow-truck.png'):require('../../assets/images/tow-truck.png')}/>
            </View>
            <View style={styles.cartInfo}>

                <Text style={styles.ServiceName}
                      numberOfLines={2}>{item.autoservice_Name}</Text>
                <View style={styles.mobileContainer}>
                    <Icon
                        name='phone'
                        type='font-awesome'
                        color={'green'}
                        size={30}
                    />
                    <Text style={styles.ServicePhone}>{formatPhoneNumber(item.autoservice_Phone)}</Text>
                </View>
            </View>
            <View style={styles.cartEnd}>
                {item.autoservice_Support24hours === true ?
                <Image source={Platform.OS=='ios'?require('../../assets/images/call-urgent.png'):require('../../assets/images/call-urgent.png')}/> : null}
            </View>
        </TouchableOpacity>
    );


    render() {
        const { serviceData } = this.props;
        if(serviceData <= 0){
            return (
                <View style={styles.container}>
                    <Image style={styles.images}
                           source={Platform.OS=='ios'?require('./../../assets/images/not-found-result.png'):require('./../../assets/images/not-found-result.png')}/>
                    <Text style={styles.emptyMessage}>Seçtiğiniz kriterlere uygun </Text>
                    <Text style={styles.emptyMessage}>çekici bulunamadı.</Text>
                </View>
            );
        }else{
            return (
                <View style={styles.cartContainer}>
                    <ScrollView style={styles.scrollViewStyle}>
                        <FlatList data={serviceData}
                                  keyExtractor={(item) => item.autoservice_Phone}
                                  renderItem={this.renderItem}
                        />
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    cartContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    cartClickArea: {
        flexDirection: 'row',
        top: 35,
        marginBottom: 35,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        borderWidth: 0.1,
        borderRadius: 15,
        height: 105,
        alignSelf: 'center',
        width: '93%',
        backgroundColor: 'white'
    },
    ServiceName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#a0230d'
    },
    ServicePhone: {
        fontWeight: 'bold',
        marginLeft: 8,
        color: 'gray'
    },
    cartLogo: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 100,
        height: 75,
        bottom: 40,
        left: 15,
        backgroundColor: 'white'
    },
    cartInfo: {
        flex: 3,
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    cartEnd: {
        width: '20%',
        padding: 5,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        right: 5
    },
    mobileContainer: {
        top: 8,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollViewStyle:{
        height: height
    },
    container:{
        flex:1,
        padding:20,
        paddingTop:80,
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

const mapStateToProps = state => {
    const localarea = state.selectLocation;
    const serviceData  = state.serviceList.result;
    return{
        serviceData, localarea
    }
};

export default connect(mapStateToProps,
    { fetchTowTruck })(TowTruckList);