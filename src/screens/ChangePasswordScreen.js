import React, { Component } from 'react';
import {
    StyleSheet, View,
    Dimensions, ScrollView,
    TouchableWithoutFeedback, Text,
    TouchableOpacity, Image, Platform, KeyboardAvoidingView
} from 'react-native';
import {colors} from '../common/theme';
import {Header, Icon, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {Actions} from "react-native-router-flux";
import {oldPasswordChanged,newPasswordChanged,reNewPasswordChanged,updatePassword} from '../actions/';
const {height} = Dimensions.get('window');

class ChangePasswordScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            errorMsg:'',
            passwordValid: true,
        };
    }

    onOldPasswordChanged(text){
        this.props.oldPasswordChanged(text);
    }
    onNewPasswordChanged(text){
        this.props.newPasswordChanged(text);
    }
    onReNewPasswordChanged(text){
        this.props.reNewPasswordChanged(text);
    }
    onUpdatePasswordClick(){
        //const passwordValid = this.validatePassword();
        if (this.validatePassword()) {
            this.props.updatePassword(this.props.oldPassword, this.props.newPassword)
        }
    }

    //validation for password
    validatePassword() {
        const { newPassword } = this.props;
        const { reNewPassword } = this.props;
        let passwordValid = true;
        //const regx1 = /^([a-zA-Z0-9@*#]{8,15})$/;
        const regx2 = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;

        if(newPassword.length <=1) {
            passwordValid = false;
            this.setState({errorMsg: "Şifre alanı boş bırakılamaz."})
        }
        else if (newPassword.length <= 6){
            passwordValid = false;
            this.setState({errorMsg: 'Şifre 7 karakterden az olmamalıdır.'})
        }

        if(newPassword != reNewPassword){
            passwordValid = false;
            this.setState({errorMsg: "Girmiş olduğunuz yeni şifreler aynı değil."})
        }

        return passwordValid
    }

    render() {
        return (
            <View style={styles.mainView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
                    <Header
                        backgroundColor={colors.GREY.default}
                        leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                        centerComponent={<Text style={styles.headerTitleStyle}>Şifre Değiştirme</Text>}
                        //rightComponent={{icon:'ios-notifications', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.navigate('Notifications');} }}
                        outerContainerStyles={styles.headerStyle}
                        innerContainerStyles={{marginLeft:10, marginRight: 10}}
                    />
                    <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"padding"} style={styles.form}>
                        <View style={styles.viewStyle}>
                            <View style={styles.imageParentView}>
                                <View style={styles.imageViewStyle}>
                                    <Image source={Platform.OS==='ios'?require('../../assets/images/profilePic.png'):require('../../assets/images/profilePic.png')} style={{borderRadius: 130/2, width: 130, height: 130}} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.newViewStyle}>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='lock'
                                    type='font-awesome'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholderTextColor={'gray'}
                                    placeholder={'Eski şifrenizi giriniz'}
                                    value={this.props.oldPassword}
                                    inputStyle={styles.inputTextStyle}
                                    secureTextEntry={true}
                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    containerStyle={styles.textInputStyle}
                                    onChangeText={this.onOldPasswordChanged.bind(this)}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='lock'
                                    type='font-awesome'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholderTextColor={'gray'}
                                    placeholder={'Yeni şifre giriniz'}
                                    value={this.props.newPassword}
                                    inputStyle={styles.inputTextStyle}
                                    secureTextEntry={true}
                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    containerStyle={styles.textInputStyle}
                                    onSubmitEditing={() => { this.validatePassword() }}
                                    onChangeText={this.onNewPasswordChanged.bind(this)}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='lock'
                                    type='font-awesome'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholderTextColor={'gray'}
                                    placeholder={'Yeni şifrenizi tekrar giriniz'}
                                    value={this.props.reNewPassword}
                                    inputStyle={styles.inputTextStyle}
                                    secureTextEntry={true}
                                    keyboardType={'default'}
                                    returnKeyType={'done'}
                                    blurOnSubmit={true}
                                    containerStyle={styles.textInputStyle}
                                    onChangeText={this.onReNewPasswordChanged.bind(this)}
                                />
                            </View>
                            <Text style={styles.errTextStyle}>{this.state.errorMsg}</Text>
                        </View>
                        <View style={styles.flexView3}>
                            <TouchableOpacity
                                onPress={() => this.onUpdatePasswordClick()}
                                style={styles.button}>
                                <Text style={styles.textStyle}>Şifremi Güncelle</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
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
    profStyle:{
        fontSize: 18,
        left: 20,
        fontWeight:'bold',
        color:colors.GREY.btnPrimary,

    },
    button:{
        marginBottom: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:10,
        height:50,
        width:'70%',
        backgroundColor: colors.GREY.default
    },
    viewStyle:{
        justifyContent:'center',
        alignItems:'center',
        marginTop: 13
    },
    imageParentView:{
        borderRadius: 150/2,
        width: 150,
        height: 150,
        backgroundColor: colors.GREY.secondary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageViewStyle:{
        borderRadius: 140/2,
        width: 140,
        height: 140,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPropStyle:{
        fontSize: 21,
        fontWeight:'bold',
        color: colors.GREY.iconSecondary,

        top: 8
    },
    textStyle:{
        fontSize: 16,
        color: colors.WHITE,
        textAlign: "center",
        fontWeight: 'bold'
    },
    errTextStyle:{
      color:colors.RED.default,
        alignSelf:'center',
        fontWeight: 'bold'
    },
    newViewStyle:{
        flex: 1,
        marginTop: 40,
        marginRight: 15,
        marginLeft: 15
    },
    flexView3:{
        marginTop: 30,
        alignItems: 'center'
    },
    textInputContainerStyle:{
        flexDirection:'row',
        alignItems: "center",
        marginRight:20,
        padding: 15
    },
    iconContainer: {
        paddingTop:8,
        width: 35
    },
    textInputStyle:{
        marginLeft:10,
        width: '90%',
    },
    form: {
        flex: 1,
        marginBottom: 75
    }
});

const mapStateToProps = state => {//reducer
    const { oldPassword,newPassword,reNewPassword } = state.changePass;
    return {
        oldPassword,newPassword,reNewPassword
    }
};

export  default  connect (mapStateToProps,{ //action
    oldPasswordChanged,newPasswordChanged,reNewPasswordChanged,updatePassword
})(ChangePasswordScreen);
