import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';

import { Basket_SVG, Red_Cir_SVG } from '../svg/SVG_Beer';

class BasketButton extends Component {
  render(){
    if ( this.props.user.login_status == true )
      return(
        <TouchableHighlight onPress={() => {Actions.basket()}}>
          <View style={styles.button}>  
            <Basket_SVG height={23} width={23} color={'#FFFFFF'}/>
            { this.props.indicator == 0 ? null :
              <View style={styles.red_cir}>
                <Red_Cir_SVG amount={this.props.indicator}/>
              </View>
            }
          </View>
        </TouchableHighlight>
      )
    else
      return(
        <Basket_SVG height={23} width={23} color='rgba(255, 255, 255, 0.4)'/>
      )
  }
}

const styles = StyleSheet.create({
  button: {
    width: 32, 
    height: 37, 
    alignItems: 'flex-end', 
    justifyContent: 'center',
  },
  red_cir: {
    position: 'absolute', 
    top: 13, 
    right: 7
  },
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps) (BasketButton);