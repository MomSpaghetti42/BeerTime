import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { strings } from '../locales/i18n';

class Discount extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View 
          style={[
            styles.ach, 
            this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
          ]}>
          <View style={this.props.language == 'ru' ? {marginRight: 64} : {marginLeft: 64}}>
            <Text style={styles.red}>{this.props.user.user.liters}</Text>
            <Text style={styles.lit}>{strings('discount.liters')}</Text>
          </View>
          <View>
            <Text style={styles.red}>{+this.props.user.user.skidka * 100}%</Text>
            <Text style={styles.lit}>{strings('discount.discount')}</Text>
          </View>
        </View>
        <Text style={styles.gray}>{strings('discount.text1')}</Text>
        <View 
          style={[
            styles.button_panel, 
            this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
          ]}>
          <View style={styles.button_enter}>
            <Text style={styles.simple_text}>{strings('discount.add')}</Text>
          </View>
        </View>
        <Text style={styles.gray}>{strings('discount.text2')}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  button_panel: {
    width: '100%',
  },
  button_enter: {
    borderColor: '#D80000',
    borderWidth: 1,
    borderRadius: 30,
    width: 172,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 28,
  },
  bold_text: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: '2.4%',
    marginBottom: 17,
  },
  simple_text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ach: {
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 19,
  },
  red: {
    color: '#D80000',
    fontSize: 38,
    fontWeight: 'bold',
  },
  lit: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gray: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps)(Discount)