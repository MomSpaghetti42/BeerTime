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
  AsyncStorage,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import { loginUser, showAlert } from '../actions/actions';
import {Actions} from 'react-native-router-flux';
import { Google_red_SVG, Facebook_red_SVG, Eye_SVG } from '../svg/SVG_Beer';
import CustomInput from '../components/CustomInput';
import { strings } from '../locales/i18n';

class Name extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      second_name: '',
    };
  }
  async regUser(){
    if (this.state.name == '') {
      this.props.dispatchShowAlert('Введите имя');
    }
    else {
      let email = await AsyncStorage.getItem('reg_email');
      let password = await AsyncStorage.getItem('reg_password');
      fetch("http://beertime.acsima.com/api/user/create", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email,
          password: password,
          name: this.state.name,
          second_name: this.state.second_name,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 'use_another_email') {
          this.props.dispatchShowAlert(strings('name.already'));
        }
        else {
          Keychain.setGenericPassword(email, password);
          this.props.dispatchLoginUser(true, responseJson);
          Actions.profile();
        }
      })
      .catch((error) => {
        this.props.dispatchShowAlert(strings('name.wrong'));
        Actions.profile();
      });
    }
  }
  changeName = (value) => {
    this.setState({name:value});
  }
  changeSecondName = (value) => {
    this.setState({second_name:value});
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.login_block}>
          {/*<Text style={styles.bold_text}>Ваше Имя</Text>*/}
          <View style={styles.login_form}>
            <Text style={styles.simple_text}>{strings('name.name')}</Text>
            <CustomInput 
              placeholder={strings('name.name_palce')}
              onChangeText={this.changeName}
            />
            <Text style={styles.simple_text}>{strings('name.second_name')}</Text>
            <CustomInput
              placeholder={strings('name.second_name_place')}
              onChangeText={this.changeSecondName}
            />
          </View>
          <View style={[
            styles.button_panel,
            this.props.language == 'he' ? {justifyContent: 'flex-start'} : {justifyContent: 'flex-end'}
            ]}
          >
            <TouchableHighlight onPress={() => this.regUser()}>
              <View style={styles.button_enter}>
                <Text style={styles.simple_text}>{strings('name.reg')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    width: '100%',
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
    dispatchLoginUser: (login_status, user) => dispatch(loginUser(login_status, user)),
    dispatchShowAlert: (text) => dispatch(showAlert(text)),
  }
}

export default connect(null, mapDispatchToProps)(Name)