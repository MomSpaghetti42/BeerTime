import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import { strings } from '../locales/i18n';

class CardOfClub extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tittle}>{strings('card_of_club.card_of_club')}</Text>
        <QRCode
          value={this.props.user.user.id}
          size={176}
          bgColor='white'
          fgColor='#121212'/>
        <Text style={styles.number}>{this.props.user.user.id}</Text>
        <Text style={styles.desc}>{strings('card_of_club.text1')}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 21,
    paddingRight: 20,
  },
  qr_code: {
    width: 176,
    height: 176,
  },
  tittle: {
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 45,
  },
  number: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 24,
    marginTop: 32,
  },
  desc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 30,
    textAlign: 'center',
  },
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps)(CardOfClub);