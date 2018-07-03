import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import { Lense_SVG } from '../svg/SVG_Beer';

class Lens extends Component {

  showSearchbar = () => {
    Actions.refresh({ hideNavBar: true });
  }

  render(){
    return(
      <TouchableHighlight onPress={this.showSearchbar}>
        <View><Lense_SVG/></View>
      </TouchableHighlight>
    )
  }
}

export default (Lens);