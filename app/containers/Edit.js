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
  Picker,
  AsyncStorage
} from 'react-native';
import { Caret } from '../svg/SVG_Beer';
import {Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
import { showAlert, loginUser, heLanguage } from '../actions/actions';
import CustomInput from '../components/CustomInput';
import { strings } from '../locales/i18n';

class Edit extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.user.user.name,
      second_name: this.props.user.user.second_name,
      phone: this.props.user.user.phone,
      language: this.props.language
    };
  }
  changeTextName = (value) => {
    this.setState({name:value});
  }
  changeSecondName = (value) => {
    this.setState({second_name:value});
  }
  changePhone = (value) => {
    this.setState({phone:value});
  }
  done = () => {
    fetch("http://beertime.acsima.com/api/user/edit", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          id: this.props.user.user.id,
          name: this.state.name,
          second_name: this.state.second_name,
          phone: this.state.phone,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == true) {
          this.props.dispatchLoginUser(true, responseJson.user);
          AsyncStorage.setItem('Language', JSON.stringify(this.state.language));
          this.props.dispatchHeLanguage(this.state.language);
          Actions.reset('main');
        }
        else {
          this.props.dispatchShowAlert('Что то пошло не так');
        }
      })
      .catch((error) => {
        this.props.dispatchShowAlert('Пробемы с сетью');
        Actions.profile();
      });
  }

  changeLanguage = async (lang) => {
    await AsyncStorage.setItem('Language', JSON.stringify(lang));
    this.props.dispatchHeLanguage(lang);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.login_block}>
          <View style={styles.login_form}>
            <Text style={styles.simple_text}>{strings('edit.name')}</Text>
            <CustomInput 
              rtl={this.props.language == "he" ? true : false}
              placeholder={strings('edit.name')} 
              onChangeText={this.changeTextName}
              autoCapitalize="sentences"
              value={this.state.name}
            />
            <Text style={styles.simple_text}>{strings('edit.second_name')}</Text>
            <CustomInput 
              rtl={this.props.language == "he" ? true : false}
              placeholder={strings('edit.second_name')}
              onChangeText={this.changeSecondName}
              autoCapitalize="sentences"
              value={this.state.second_name}
            />
            <Text style={styles.simple_text}>{strings('edit.phone')}</Text>
            <CustomInput 
              rtl={this.props.language == "he" ? true : false}
              placeholder={strings('edit.phone')} 
              onChangeText={this.changePhone}
              keyboardType="phone-pad"
              value={this.state.phone}
            />
            <Text style={styles.simple_text}>{strings('edit.language')}</Text>
            <View style={styles.input_box_picker}>
              <Picker
                selectedValue={this.state.language}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue}) }>
                <Picker.Item label="Русский" value="ru" />
                <Picker.Item label="עברית" value="he" />
              </Picker>
              <View 
                style={[
                  styles.caret,
                  this.state.language == 'he' ? {left: 12} : {right: 12},
                ]} 
              >
                <Caret/>
              </View>
            </View>
          </View>
          <View style={[
            styles.button_panel,
            this.props.language == 'he' ? {justifyContent: 'flex-start'} : {justifyContent: 'flex-end'}
            ]}
          >
            <TouchableHighlight onPress={() => this.done()}>
              <View style={styles.button_enter}>
                <Text style={styles.simple_text}>{strings('edit.ready')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    color: '#FFFFFF',
    backgroundColor: '#121212',
    height: 40,
  },
  input_box_picker: {
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 13,
  },
  caret: {
    position: 'absolute', 
    top: 20,
  },
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
    dispatchLoginUser: (login_status, user) => dispatch(loginUser(login_status, user)),
    dispatchShowAlert: (text) => dispatch(showAlert(text)),
    dispatchHeLanguage: (lang) => dispatch(heLanguage(lang))
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Edit);