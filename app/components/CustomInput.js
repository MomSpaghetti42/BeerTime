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
  Keyboard,
} from 'react-native';
import { Google_red_SVG, Facebook_red_SVG, Eye_SVG } from '../svg/SVG_Beer';

class CustomInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: this.props.secureTextEntry,
      underlineColor: 'rgba(255, 255, 255, 0.2)',
    };
  }
  switchColor(){
    if (this.state.underlineColor == 'rgba(255, 255, 255, 0.2)') {
      this.setState({underlineColor: '#FFFFFF'});
    }
    else{
      this.setState({underlineColor: 'rgba(255, 255, 255, 0.2)'});
    }
  }
  changeText = (value) => {
    this.props.onChangeText(value);
  }
  _onFocus = () => {
    if (this.props.onFocus == null) {
      this.switchColor();
    }
    else {
      this.switchColor();
      this.props.onFocus();
    }  
  }
  render(){
    return (
      <View style={[styles.input_box, { borderBottomColor: this.state.underlineColor }]}>
        <TextInput
          style={[styles.text_input, this.props.rtl == true ? {textAlign: 'right'} : {textAlign: 'auto'}]}
          placeholder={this.props.placeholder}
          placeholderTextColor='rgba(255, 255, 255, 0.4)'
          underlineColorAndroid='transparent'
          selectionColor="#FFFFFF"
          onFocus={this._onFocus}
          onBlur={() => {this.switchColor()}}
          keyboardType={this.props.keyboardType}
          secureTextEntry={this.state.secureTextEntry}
          value={this.props.value}
          onChangeText={(value) => this.changeText(value)}
          keyboardType={this.props.keyboardType}
          autoCapitalize={this.props.autoCapitalize}
          onEndEditing={this.props.onEndEditing}
          multiline={this.props.multiline}
        />
        { (this.props.secureTextEntry == true) ?
          <View style={[
              styles.eye,
              this.props.rtl == true ? {left: 9} : {right: 9}
            ]}
          >
            <TouchableHighlight onPress={ () => this.setState({secureTextEntry: !this.state.secureTextEntry })}>
            <View>
              <Eye_SVG />
            </View>
            </TouchableHighlight>
          </View>
          : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 41,
  },
  login_block: {
    width: '100%',
  },
  login_form: {
  },
  button_panel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
});

export default CustomInput;