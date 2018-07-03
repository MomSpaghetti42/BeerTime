import React, { Component } from 'react';
import {Actions} from 'react-native-router-flux';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Car_SVG, Beer_SVG, Profile_SVG } from '../svg/SVG_Beer';
import { strings } from '../locales/i18n';

class Main extends Component {
  render(){
    return(
      <View style={styles.container}>
        <Image source={require('../img/main_logo.png')} style={styles.img} />
        <View style={styles.menu}>
          <TouchableHighlight style={styles.button} onPress={Actions.orders}>
            <View 
              style={[
                styles.in_button, 
                this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
              ]}
            >
              <View style={styles.icon}>
                <Car_SVG color="#D80000" height={28} width={30} />
              </View>
        		  <Text 
                style={[
                  styles.text_button, 
                  this.props.language == 'ru' ? {marginLeft: 22} : {marginRight: 22}
                ]} 
              >
                {strings('menu.orders')}
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={Actions.catalog}>
            <View 
              style={[
                styles.in_button, 
                this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
              ]}
            >
              <View style={styles.icon}>
                <Beer_SVG color="#D80000" height={35} width={32} />
              </View>
              <Text 
                style={[
                  styles.text_button, 
                  this.props.language == 'ru' ? {marginLeft: 22} : {marginRight: 22}
                ]} 
              >
                {strings('menu.catalog')}
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={Actions.profile}>
            <View 
              style={[
                styles.in_button, 
                this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
              ]}
            >
              <View style={styles.icon}>
                <Profile_SVG color="#D80000" height={34} width={34} />
              </View>
              <Text 
                style={[
                  styles.text_button, 
                  this.props.language == 'ru' ? {marginLeft: 22} : {marginRight: 22}
                ]} 
              >
                {strings('menu.profile')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  	flex: 1,
    justifyContent: 'space-around', 
    alignItems: 'center',
    backgroundColor: '#0C0C0C',

  },
  menu: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button:{
    height: 84,
    width: '100%',
    justifyContent: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomWidth: 1,
    paddingLeft: 40,
    paddingRight: 40,
  },
  in_button: {
    width: '100%',
    alignItems: 'center',
  },
  text_button: {
    flex: 1,
    color: 'rgba(0, 0, 0, 0.9)',
    fontSize: 18,
  },
  img: {
    width: '100%',
    height: '50%', 
  },
  icon: {
    width: 34,
  },
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps)(Main);