import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { GoogleSignin } from 'react-native-google-signin';
import * as Keychain from 'react-native-keychain';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

import { loginUser, showAlert, logoutUser, showApp } from '../actions/actions';
import { strings } from '../locales/i18n';

import CustomInput from '../components/CustomInput';
import { Pen_SVG, Card_SVG , Percent_SVG, Door_SVG, Gradient_Cir_SVG, Success_SVG, Google_red_SVG, Facebook_red_SVG } from '../svg/SVG_Beer';
import { FetchLogin } from '../query/query';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
    };
  }
  componentDidMount() {
    this._setupGoogleSignin();
  }
  render(){
    if (this.props.user.login_status == true) {
      return (
        <View style={styles.container}>
          <View 
            style={[
              styles.information,
              this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}
            ]}
          >
            <View style={this.props.language == 'he' ? {alignItems: 'flex-end'} : {alignItems: 'flex-start'} }>
              <Text style={styles.bold}>
              {
                this.props.user.user.second_name != null ? 
                this.props.user.user.name +' '+ this.props.user.user.second_name 
                : this.props.user.user.name
              }
              </Text>
              <View style={styles.field_block}>
                <Text style={styles.gray}>{strings('profile.post')}</Text>
                <Text style={styles.white}>{this.props.user.user.email}</Text>
              </View>
              <View style={styles.field_block}>
                <Text style={styles.gray}>{strings('profile.phone')}</Text>
                <Text style={styles.white}>
                  {
                    this.props.user.user.phone == null || this.props.user.user.phone == undefined ? strings('profile.not_specified') :
                    this.props.user.user.phone
                  }
                </Text>
              </View>
              {/*<View style={styles.field_block}>
                <Text style={styles.gray}>Оплата</Text>
                <Text style={styles.white}>PayPal</Text>
                <Text style={styles.white}>не указан</Text>
              </View>*/}
            </View>
            <View style={styles.achived}>
              <View style={styles.ach}>
                <Gradient_Cir_SVG amount={this.props.user.user.liters}/>
                <Text style={styles.lit}>{strings('profile.liters')}</Text>
              </View>
              <View style={styles.ach}>
                <Text style={styles.percent}>{+this.props.user.user.skidka * 100}%</Text>
                <Text style={styles.lit}>{strings('profile.discount')}</Text>
              </View>
            </View>
          </View>
          <View style={styles.button_panel}>
            <TouchableHighlight onPress={Actions.discount}>
              <View style={styles.button}>
                <Percent_SVG />
                <Text style={styles.text_button}>{strings('profile.discount_and_bonus')}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={Actions.card_of_club}>
              <View style={styles.button}>
                <Card_SVG />
                <Text style={styles.text_button}>{strings('profile.card_of_club')}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={Actions.edit}>
              <View style={styles.button}>
                <Pen_SVG />
                <Text style={styles.text_button}>{strings('profile.edit')}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.logOut}>
              <View style={styles.button}>
                <Door_SVG />
                <Text style={styles.text_button}>{strings('profile.out')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
    else {
      return(
        <View style={login.container2}>
          <View style={login.login_block}>
            <View style={login.login_form}>
              <Text style={login.simple_text}>{strings('login.post')}</Text>
              <CustomInput 
                placeholder={strings('login.post_placeholder')} 
                value={this.state.email} 
                onChangeText={(value) => {this.setState({email:value})}} 
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={login.simple_text}>{strings('login.password')}</Text>
              <CustomInput 
                placeholder={strings('login.pass_placeholder')} 
                secureTextEntry={true} 
                value={this.state.password} 
                onChangeText={(value) => {this.setState({password:value})}}
                autoCapitalize="none"
                rtl={this.props.language == "he" ? true : false}
              />
            </View>
            <View style={login.button_panel}>
              <View style={login.soc}>
                <TouchableHighlight onPress={this.Google_login}>
                  <View>
                  <Google_red_SVG/>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.Facebook_login}>
                  <View>
                  <Facebook_red_SVG/>
                  </View>
                </TouchableHighlight>
              </View>
              <TouchableHighlight onPress={this.logIn}>
                <View style={login.button_enter}>
                  <Text style={login.simple_text}>{strings('login.enter')}</Text>
                </View>
              </TouchableHighlight>
            </View>
            <TouchableHighlight style={{marginTop: 41,}} onPress={Actions.registration}>
              <Text style={login.red_text}>{strings('login.no_profile')}</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }
  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: '343428849830-vtafu2ve5d4vf36m6tcvo8jf83c3qvl9.apps.googleusercontent.com',
        offlineAccess: true
      });

      const user = await GoogleSignin.currentUserAsync();
    }
    catch(err) {
      console.log(err.code, err.message);
    }
  }
  Google_login = () => {
    GoogleSignin.signIn()
    .then((data) => {
      let user = {
        id: data.id,
        email: data.email,
        givenName: data.givenName,
        familyName: data.familyName,
      }
      FetchLogin(user)
      .then(response => {
        if (response.success == true) {
          this.props.dispatchLoginUser(true, response.user);
          let userJson = JSON.stringify(response.user);
          AsyncStorage.setItem('logined_user', userJson);
        }
        else {
          this.props.dispatchShowAlert(strings('profile.wrong'));
        }
      })
    })
    .catch((err) => {
      this.props.dispatchShowAlert(strings('profile.net_problem'));
    })
    .done();
  }

  Facebook_login = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('Login success with permissions: ' +result.grantedPermissions.toString());
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      }
    )
    .then(() => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          httpMethod: 'GET',
          version: 'v2.5',
          parameters: {
              'fields': {
                  'string' : 'name, email'
              }
          }
        },
        this._responseInfoCallback,
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    })
  }

  _responseInfoCallback = (error: ?Object, result: ?Object) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      let user = {
        fb_id: result.id,
        email: result.email,
        name: result.name.split(' ')[0],
        familyName: result.name.split(' ')[1],
      }
      FetchLogin(user)
      .then(response => {
        if (response.success == true) {
          this.props.dispatchLoginUser(true, response.user);
          let userJson = JSON.stringify(response.user);
          AsyncStorage.setItem('logined_user', userJson);
        }
        else {
          this.props.dispatchShowAlert(strings('profile.wrong'));
        }
      })
    }
  }

  logIn = () => {
    let user = {
      email: this.state.email,
      password: this.state.password,
    }
    FetchLogin(user).then(response => {
      if (response != 'error'){
        if (response.success == true) {
          this.props.dispatchShowApp(false)
          Keychain.setGenericPassword(this.state.email, this.state.password);
          this.props.dispatchLoginUser(true, response.user);
          let userJson = JSON.stringify(response.user);
          AsyncStorage.setItem('logined_user', userJson);
          if (response.role == "Courier") {
            Actions.reset('courier');
            if (this.props.app_state.socket.readyState === this.props.app_state.socket.OPEN) {
              let data = JSON.stringify({
                cmd: 'newConn',
                data: {id: response.user.id}
              })
              this.props.app_state.socket.send(data);
            }
          }
        }
        else {
          this.props.dispatchShowAlert(strings('profile.undefined_user'));
        }
      }
      else {this.props.dispatchShowAlert(strings('profile.net_problem'))}
    })
    .then(() => { this.props.dispatchShowApp(true) })
  }
  logOut = async () => {
    Keychain.resetGenericPassword();
    GoogleSignin.signOut()
    LoginManager.logOut();
    await AsyncStorage.setItem('logined_user', 'false');
    this.props.dispatchLoginUser(false, {});
  }
}

const styles = StyleSheet.create({
  button_text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button_ok: {
    borderColor: '#D80000',
    borderWidth: 1,
    borderRadius: 30,
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert_overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.6)',
  },
  alert_text: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 5,
  },
  alert_wrong: {
    width: '90%',
    height: 140,
    backgroundColor: '#0C0C0C',
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 14,
    paddingRight: 19,
    paddingLeft: 19,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button_panel: {
    width: '100%',
    paddingBottom: 5,
  },
  button: {
    height: 57,
    borderTopWidth: 1,
    width: '100%',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingLeft: 20,
    paddingRight: 20,
  },
  text_button: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  information: {
    width: '100%',
    paddingLeft: 24,
    paddingRight: 25,
    justifyContent: 'space-between',
  },
  field_block: {
    marginTop: 14,
  },
  bold: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 11,
  },
  gray: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
  },
  white: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  percent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D80000',
  },
  ach: {
    marginBottom: 18,
    alignItems: 'center',
  },
  lit: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const login = StyleSheet.create({
    container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 41,
  },
  login_block: {
    width: '100%',
  },
  login_form: {
    marginBottom: 23,
  },
  button_panel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  soc: {
    width: 116,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button_enter: {
    borderColor: '#D80000',
    borderWidth: 1,
    borderRadius: 30,
    width: 149,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  red_text: {
    color: '#D80000',
    fontSize: 16,
  },
  bold_text: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  simple_text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input_box: {
    height: 46,
    borderBottomWidth: 1,
    marginBottom: 13,
  },
  text_input:{
    fontSize: 16,
    color: '#ffffff',
  },
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchLoginUser: (login_status, user) => dispatch(loginUser(login_status, user)),
    dispatchShowAlert: (text) => dispatch(showAlert(text)),
    dispatchShowApp: (status) => dispatch(showApp(status)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)