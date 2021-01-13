import React, { Component } from 'react';
import {
    Alert,
    Dimensions,
    Image, Platform,
    ScrollView,
    StyleSheet, Text, TouchableWithoutFeedback, View
} from 'react-native';
import {Button, Header} from 'react-native-elements';
import { Background } from '../components';
import {colors} from "../common/theme";
import {Actions} from "react-native-router-flux";
import RNPickerSelect from "react-native-picker-select";
import {connect} from "react-redux";
import {continueNextPage, districtChanged, provinceChanged} from "../actions";
import {apiUrlCommon} from "../apiUrlCommon";
import {GetOnWhichScreenCommon} from "../common/functionCommon";
import {GeneralFailedMessage} from "../common/ExceptionMessage";

const {height} = Dimensions.get('window');

let markers = [];
let markersDis = [];

class RegisterSelectLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false,
            areaDetail: [],
            localDetail: [],
            provinceErr: ''}
    }

    componentDidMount() {
        return this.getProvinceData();
    }

    validateSelectList() {
        const { province } = this.props;
        let provinceValid = true;
        if(province == null || province === "") {
            this.setState({ provinceErr: 'Lütfen bir il seçiniz !'});
            provinceValid = false;
        }
        return provinceValid
    }

    getProvinceData = async () => {
        try {
            const response = await fetch(apiUrlCommon + "cities");
            const json = await response.json();
            this.setState({ data: json, loading:false });

            markers = this.state.data.map((items) => {
                return {
                    label: items.city_Name,
                    value:  items.city_ID,
                };
            });
            await this.setState({
                areaDetail: markers // add this
            });

        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    getDistrictsData = async (text) => {
        markersDis = [];
        if (text == null){
            text = 34}
        try {
            const response = await fetch(apiUrlCommon + "cities/cityIdGetDistricts/"+text);
            const json = await response.json();
            this.setState({ datadis: json, loading:false });
            for(let items of this.state.datadis) {
                markersDis.push({
                    label:     items.districts.district_Name,
                    value:     items.districts.district_ID
                });
                await this.setState({
                    localDetail: markersDis // add this
                });
            }
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
    };

    onProvinceChange(text){
        this.setState({ provinceErr: ''});
        this.props.provinceChanged(text);
        return this.getDistrictsData(text);
    }

    onDistrictChange(text){
        this.props.districtChanged(text)
    }

    onNextServicePageClicked(){
        const provinceValid = this.validateSelectList();
        if (provinceValid){
            this.props.continueNextPage();
        }
    }

    render() {
        const placeholderCity = {
            label: 'Lütfen il seçiniz...',
            value: null,
            color: 'gray',
        };

        const placeholderDistrict = {
            label: 'Lütfen ilçe seçiniz...',
            value: null,
            color: 'gray',
        };
        return (
            <Background>
                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>Acil Yardım</Text>}
                    rightComponent={{icon:'home', type:'font-awesome', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: async ()=>{
                        const userType = await GetOnWhichScreenCommon();
                        if (userType === 'master'){
                            Actions.MasterProfileScreen();
                        }else if(userType === 'driver'){
                            Actions.ProfileScreen();
                        }
                        } }}
                    outerContainerStyles={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />
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
                            <Text style={styles.selectListText}>İl Seçiniz</Text>
                            {/* and iOS onUpArrow/onDownArrow toggle example */}
                            <RNPickerSelect
                                placeholder={placeholderCity}
                                onValueChange={this.onProvinceChange.bind(this)}
                                items={markers}
                                style={styles}
                                value={this.props.province}
                                useNativeAndroidPickerStyle={false}
                                doneText={'Bitti'}
                            />
                            <Text style={styles.selectError}>{this.state.provinceErr}</Text>
                        </ScrollView>
                        <ScrollView style={styles.selectListStyle}>
                            <Text style={styles.selectListText}>İlçe Seçiniz</Text>
                            {/* and iOS onUpArrow/onDownArrow toggle example */}
                            <RNPickerSelect
                                placeholder={placeholderDistrict}
                                items={markersDis}
                                onValueChange={this.onDistrictChange.bind(this)}
                                style={styles}
                                value={this.props.district}
                                useNativeAndroidPickerStyle={false}
                                doneText={'Bitti'}
                            />
                        </ScrollView>
                        <View style={styles.buttonArea}>
                            <Button
                                onPress={()=>{this.onNextServicePageClicked()}}
                                title="Devam Et"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.registerButton}
                            />
                        </View>
                    </View>
                </ScrollView>
            </Background>
        );
    }
}

const styles = StyleSheet.create({
    headerTitleStyle: {
        color: colors.WHITE,
        fontSize: 20
    },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    logo:{
        width:'100%',
        justifyContent:"flex-start",
        marginTop: 80,
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
        paddingTop: 10,
        paddingRight: 20,
        paddingLeft: 20
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
    buttonArea: {
        flex: 2,
        alignItems: 'center',
        top: 20,
        marginBottom:30,
        marginTop:50
    },
    scrollViewStyle:{
        height: height
    },
    selectError:{
        color: 'red',
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 17,
    }
});

const mapStateToProps = state => {
    const { province, district } = state.selectLocation;
    return {
        province, district
    }
};

export default connect(mapStateToProps,
    { provinceChanged, districtChanged, continueNextPage })(RegisterSelectLocationScreen);