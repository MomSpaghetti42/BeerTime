import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  ScrollView,
  Alert,
  AsyncStorage,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
import { showAlert } from '../actions/actions';
import { Google_red_SVG, Facebook_red_SVG, Eye_SVG } from '../svg/SVG_Beer';
import CustomInput from '../components/CustomInput';
import { strings } from '../locales/i18n';

class Registration extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      showAlert: false,
      password: '',
      password__repeat: '',
    };
  }
  changeTextEmail = (value) => {
    this.setState({email:value});
  }
  changePassword = (value) => {
    this.setState({password:value});
  }
  changeRepeatPassword = (value) => {
    this.setState({password__repeat:value});
  }
  ValidateEmail = (mail) =>  
  {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
      return (true)
    }
      return (false)
  }
  async goNext(){
    if (this.ValidateEmail(this.state.email))  {
      if (this.state.password == this.state.password__repeat) {
        await AsyncStorage.setItem('reg_email', this.state.email);
        await AsyncStorage.setItem('reg_password', this.state.password);
        Actions.name();
      } 
      else {
        this.props.dispatchShowAlert(strings('registration.not_match'));
      }
    }
    else {
      this.props.dispatchShowAlert(strings('registration.corect_email'));
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.login_block}>
          <View style={styles.login_form}>
            <Text style={styles.simple_text}>{strings('registration.post')}</Text>
            <CustomInput 
              placeholder={strings('registration.post_placeholder')}  
              keyboardType="email-address"
              onChangeText={this.changeTextEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.simple_text}>{strings('registration.password')}</Text>
            <CustomInput 
              placeholder={strings('registration.pass_placeholder')} 
              secureTextEntry={true}
              onChangeText={this.changePassword}
              autoCapitalize="none"
              rtl={this.props.language == "he" ? true : false}
            />
            <Text style={styles.simple_text}>{strings('registration.repeat_pass')}</Text>
            <CustomInput 
              placeholder={strings('registration.pass_placeholder')}  
              secureTextEntry={true}
              onChangeText={this.changeRepeatPassword}
              autoCapitalize="none"
              rtl={this.props.language == "he" ? true : false}
            />
          </View>
          <View style={[
            styles.button_panel,
            this.props.language == 'he' ? {justifyContent: 'flex-start'} : {justifyContent: 'flex-end'}
            ]}
          >
            <TouchableHighlight onPress={() => this.goNext()}>
              <View style={styles.button_enter}>
                <Text style={styles.simple_text}>{strings('registration.next')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    )
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
    height: 120,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 41,
  },
  login_block: {
    width: '100%',
  },
  login_form: {
    marginTop: 36,
  },
  button_panel: {
    flexDirection: 'row',
    marginTop: '5.4%',
    marginBottom: '5.4%',
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
    lineHeight: 22,
  },
  bold_text: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: '2.4%',
    marginBottom: '3.1%',
  },
  simple_text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input_box: {
    height: 46,
    borderBottomWidth: 1,
    marginBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text_input:{
    fontSize: 16,
    color: '#ffffff',
    width: '100%',
  },
  eye: {
    position: 'absolute',
    right: 9,
  },
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchShowAlert: (text) => dispatch(showAlert(text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Registration);