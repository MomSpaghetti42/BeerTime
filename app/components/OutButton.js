import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import { loginUser } from '../actions/actions';
import { Door_2_SVG, Planet } from '../svg/SVG_Beer';
import {Actions} from 'react-native-router-flux';

class OutButton extends Component {

  LogOutCour = () => {
    Keychain.resetGenericPassword();
    this.props.dispatchLoginUser(false, {});
    Actions.reset('main');
  }

  render(){
    return(
      <View style={{width: 70, flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableHighlight >
          <View>
            <Planet/>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.LogOutCour}>
          <View>
            <Door_2_SVG/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchLoginUser: (login_status, user) => dispatch(loginUser(login_status, user)),
  }
}

export default connect(null, mapDispatchToProps)(OutButton)