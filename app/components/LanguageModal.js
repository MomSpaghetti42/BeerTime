import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text, 
  TouchableHighlight, 
  AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { showApp, heLanguage, set_catalog } from '../actions/actions';

import { RequestCatalog } from '../query/query';

class LanguageModal extends Component {

  async setLanguage(language) {
    await AsyncStorage.setItem('Language', JSON.stringify(language));
    this.props.dispatchHeLanguage(language);
    this.props.dispatchShowApp(true);
  }

  render(){
    return(
      <View style={{flex: 1, backgroundColor:'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: '90%', backgroundColor: '#FFFFFF', borderRadius: 20 }}>
          <TouchableHighlight 
            onPress={() => this.setLanguage('ru')}
            style={{height: 100, justifyContent: 'center', paddingLeft: 40, paddingRight: 40, borderBottomColor: 'rgba(0, 0, 0, 0.15)', borderBottomWidth: 1}}>
            <Text style={{color: 'rgba(0, 0, 0, 0.9)', fontSize: 18}}>Русский</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.setLanguage('he')}
            style={{height: 100, justifyContent: 'center', paddingLeft: 40, paddingRight: 40}}>
            <Text style={{color: 'rgba(0, 0, 0, 0.9)', fontSize: 18}}>עברית</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchShowApp: (status) => dispatch(showApp(status)),
    dispatchHeLanguage: (lang) => dispatch(heLanguage(lang)),
    dispatchSetCatalog: (catalog) => dispatch(set_catalog(catalog)),
  }
}

export default connect(null, mapDispatchToProps) (LanguageModal);