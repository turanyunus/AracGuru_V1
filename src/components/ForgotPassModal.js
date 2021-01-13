import React, { Component } from 'react';
import {Modal, View, StyleSheet, Text, Dimensions, LayoutAnimation, Alert, TouchableOpacity} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { colors } from '../common/theme';
import { apiUrlCommon } from "../apiUrlCommon";
import { NoDataFoundEmail} from "../common/ExceptionMessage";
import { ForgotPasswordInput } from "../models/ForgotPasswordInput";
import { GetOnWhichScreenCommon } from "../common/functionCommon";
import SpinnerPage from "../common/spinner";

const {width} = Dimensions.get('window');

export default class ForgotPassModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            emailValid: true,
            loading:false
        }
    }
    //validation for email
    validateEmail() {
        const { email } = this.state;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email)
        LayoutAnimation.easeInEaseOut()
        this.setState({ emailValid })
        emailValid || this.emailInput.shake()
        return emailValid
    }

    //login press for validation check
    onPressForgot = async () => {
        const onWhichScreen =  await  GetOnWhichScreenCommon();
        LayoutAnimation.easeInEaseOut();
        const emailValid = this.validateEmail();

        if (emailValid){
            var whichUrl ='';
            if (onWhichScreen === 'driver') {
                whichUrl = 'customer_user'
            }else if (onWhichScreen === 'master'){
                whichUrl = 'auto_service_master'
            }

            try{
                this.setState({loading : true});
                let model = new ForgotPasswordInput();
                model.email = this.state.email;

                fetch(apiUrlCommon + whichUrl +'/ForgotPassword',{
                    method:'PUT' ,
                    headers :{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(model)
                })
                    .then((res)=> res.json())
                    .then((res) => {
                        this.setState({loading : false});
                        if (res.error != null)
                            Alert.alert(
                                NoDataFoundEmail,
                                '',
                                [{ text: 'Tamam'}
                                ],
                            );
                        else{
                            this.setState({ email:''});
                            Alert.alert('Yeni şifreniz email hesabınıza gönderilmiştir',
                                '',
                                [{ text: 'Tamam'}]);
                        }


                    })
                    .catch((err) => {
                        this.setState({loading : false});
                        Alert.alert(
                            NoDataFoundEmail,
                            '',
                            [{ text: 'Tamam'}
                            ],
                        );
                    });
            }catch (e) {
                this.setState({loading : false});
                Alert.alert(
                    NoDataFoundEmail,
                    '',
                    [{ text: 'Tamam'}
                    ],
                );
            }
        } // end if (emailValid)

    };

    render(){
        const { requestmodalclose, modalvisable } = this.props;
        const {loading} = this.state;
        const registerButton = loading ? (
            <SpinnerPage />
        ):(
            <Button
                title={'Eposta Gönder'}
                onPress={()=>{this.onPressForgot()}}
                buttonStyle={styles.buttonStyle}
                titleStyle={styles.buttonTitle}
            />
        );

        return (
        <Modal
            visible={modalvisable}
            animationType={'slide'}
            transparent={true}
            onRequestClose={requestmodalclose} >
            <View style={styles.newName}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerStyle}>
                        <View style={styles.forgotContainer}>
                            <View style={styles.forgot}></View>
                            <View style={styles.forgotStyle}>
                                <Text style={styles.forgotPassText}>Şifremi unuttum</Text>
                            </View>
                            <View style={styles.crossIconContainer}>
                                <Icon name='close' type="fontawesome"color='#fff' onPress={requestmodalclose} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Input
                            ref={input => (this.emailInput = input)}
                            editable={true}
                            underlineColorAndroid={colors.TRANSPARENT}
                            placeholder={'Email'}
                            placeholderTextColor={colors.BLACK}
                            value={this.state.email}
                            keyboardType={'email-address'}
                            inputStyle={styles.inputTextStyle}
                            onChangeText={(text)=>{this.setState({email: text})}}
                            errorMessage={this.state.emailValid ? null : 'Lütfen geçerli bir E-Mail adresi giriniz.'}
                            secureTextEntry={false}
                            blurOnSubmit={true}
                            onSubmitEditing={() => { this.validateEmail() }}
                            errorStyle={styles.errorMessageStyle}
                            inputContainerStyle={styles.emailInputContainerStyle}
                            containerStyle={styles.emailInputContainer}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        {registerButton}
                    </View>
                </View>
            </View>

        </Modal>
        )
    }
}

const styles=StyleSheet.create({
    newName: {
        flex: 1,
        width: '100%',
        height: '100%',
        //justifyContent: 'center',
        top: 100,
        alignItems: 'center',
    },
      emailInputContainer: {
        borderTopRightRadius:10,
        borderTopLeftRadius: 10,
        paddingLeft: 10,
        backgroundColor: colors.WHITE,
        paddingRight: 10,
        paddingTop:10,
        width: width-80
    },
    errorMessageStyle: {
        fontSize: 15,
        fontWeight:'bold'
    },
    inputTextStyle: {
        color:colors.BLACK,
        fontSize:16
    },
    buttonStyle: { elevation:0, bottom:15,width:'80%', alignSelf:"center",borderRadius: 20,borderColor: "transparent",backgroundColor: colors.GREY.btnPrimary,},
    buttonContainer: {flex:1, justifyContent:'center'},
    inputContainer: {flex:3, justifyContent:"center"},
    headerContainer: {height:250, backgroundColor:'#fff',width:'80%', justifyContent:'space-evenly'},
    headerStyle: {flex:1, flexDirection:'column',backgroundColor:colors.GREY.default, justifyContent:"center"},
    forgotPassText: {textAlign:"center",color:'#fff',fontSize:20,width:"100%"},
    forgotContainer: {flexDirection:"row", justifyContent:"space-between"},
    forgotStyle: {flex:3, justifyContent:"center"},
    crossIconContainer: {flex:1,left:'40%'},
    forgot: {flex:1},
    buttonTitle:{
        fontWeight: 'bold',
        fontSize: 18,
        width:'100%',
        textAlign:'center'
    }
});
