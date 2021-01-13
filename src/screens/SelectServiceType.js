import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView, Dimensions, Platform, Alert
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Button} from 'react-native-elements';
import { Background } from '../components';
import {colors, theme} from "../common/theme";
import { Actions } from 'react-native-router-flux';
import {apiUrlCommon} from "../apiUrlCommon";
import {serviceTypeChanged, masterNextPage} from "../actions";
import { connect } from 'react-redux';
import {GeneralFailedMessage} from "../common/ExceptionMessage";

const {height} = Dimensions.get('window');

let markers = [];

class SelectServiceType extends Component {

    constructor(props) {
        super(props);
        this.state = { loaded: false,
            faultErr: '',
            faultDetail: []
        }
    }

    componentWillMount() {
        return this.fetchServicesType();
    }

    validateFaultList() {
        const { serviceType } = this.props;
        let faultValid = true;
        if(serviceType == null || serviceType === "") {
            this.setState({ faultErr: 'Lütfen bir arıza tipi seçiniz !'});
            faultValid = false;
        }
        return faultValid
    }

    fetchServicesType = async () => {
        markers = [];
        try {
            const response = await fetch(apiUrlCommon + "category");
            const json = await response.json();
            this.setState({ data: json, loading:false });
            for(let items of this.state.data) {
                markers.push({
                    value:     items.category_ID,
                    label:     items.category_Name,
                    key  :     items.category_ID
                });
                await this.setState({
                    faultDetail: markers // add this
                });
            }
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }

    };

    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
    };

    NextTowTruck =  () => {
        Actions.TowTruckList()
    };

    onServiceTypeChange(text){
        this.setState({ faultErr: ''});
        this.props.serviceTypeChanged(text);
    }

    onNextListScreenPageClicked(){
        const faultValid = this.validateFaultList();
        if (faultValid) {
            this.props.masterNextPage();
        }
    }

    render() {
        const placeholder = {
            label: 'Lütfen arıza tipi seçiniz...',
            value: null,
            color: 'gray',
        };
        return (
            <Background>
                <ScrollView style={styles.scrollViewStyle}>
                    <View style={styles.logo}>
                        <Image style={{width: 110, height: 90}} source={Platform.OS==='ios'?require('../../assets/images/logo-100.png'):require('../../assets/images/logo-100.png')}
                               onLoad={this._onLoad}/>
                        {!this.state.loaded &&
                        <Image style={{width: 110, height: 90}} source={Platform.OS==='ios'?require('../../assets/images/logo-100.png'):require('../../assets/images/logo-100.png')}/>
                        }
                    </View>
                    <View style={styles.containerBottom}>
                        <ScrollView style={styles.selectListStyle}>
                            <Text style={styles.selectListText}>Arıza Tipi Seçiniz</Text>
                            {/* and iOS onUpArrow/onDownArrow toggle example */}
                            <RNPickerSelect
                                placeholder={placeholder}
                                items={markers}
                                onValueChange={this.onServiceTypeChange.bind(this)}
                                style={styles}
                                value={this.props.serviceType}
                                useNativeAndroidPickerStyle={false}
                                doneText={'Bitti'}
                            />
                            <Text style={styles.selectError}>{this.state.faultErr}</Text>
                        </ScrollView>
                        <View style={styles.buttonArea}>
                            <Button
                                onPress={()=>{this.onNextListScreenPageClicked()}}
                                title="Servisleri Getir"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.registerButton}
                            />
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.orText}> Ya da Hemen Şimdi !</Text>
                        </View>
                        <View style={styles.buttonTowTruck}>
                            <Button
                                onPress={()=>{this.NextTowTruck()}}
                                title="Çekici Çağır"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.truckButton}
                            />
                        </View>
                    </View>
                </ScrollView>
            </Background>
        );
    }
}

const styles = StyleSheet.create({
    logo:{
        width:'100%',
        justifyContent:"flex-start",
        marginTop: 60,
        alignItems:'center',
    },
    containerBottom: {
        flex: 1,
        margin: 20,
        width:'90%',
        flexDirection:'column',
        justifyContent: 'center'
    },
    selectListStyle: {
        padding: 5
    },
    selectListText: {
        fontSize: 16,
        color: 'white',
        bottom: 5,
    },
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    buttonTitle: {
        fontSize:20
    },
    registerButton: {
        backgroundColor: colors.SKY,
        width: 180,
        height: 50,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius:15
    },
    truckButton: {
        backgroundColor:'#f0b417',
        width: 180,
        height: 50,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius:15,
    },
    buttonArea: {
        flex: 2,
        //margin: 35,
        alignItems: 'center'
    },
    textView: {
        top: 10,
        paddingBottom: 18,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderColor: 'white',
        alignItems: 'center',
    },
    buttonTowTruck: {
        flex: 2,
        margin: 25,
        alignItems: 'center',
    },
    orText: {
        fontSize: 25,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
        top: 10,
    },
    scrollViewStyle:{
        height: height
    },
    selectError:{
        color: 'red',
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 17
    }
});

const mapStateToProps = state => {
    const { serviceType } = state.selectLocation;
    return {
        serviceType
    }
};

export default connect(mapStateToProps, { serviceTypeChanged, masterNextPage })(SelectServiceType);