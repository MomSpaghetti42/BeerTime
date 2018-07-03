import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Beer_SVG, Track, Clock_SVG } from '../svg/SVG_Beer';
import { strings } from '../locales/i18n';

class CardOfOrder extends Component {
  render() {
    return(
      <View style={this.props.language == 'he' ? styles.revers_order_block : styles.order_block}>
        <View style={styles.order_inner_left}>
          <View style={styles.deliver_status_block}>
            <View style={this.props.language == 'he' ? styles.revers_deliver_status : styles.deliver_status}>
              <View style={this.props.language == 'he' ? styles.revers_deliver_icon : styles.deliver_icon}>
              {
                this.props.status == 6 ? <Beer_SVG color="#D80000" height={15} width={13}/> : 
                this.props.status == 7 ? <Beer_SVG color="#6d6d6d" height={15} width={13}/> : 
                <Clock_SVG />
              }
              </View>
              {
                this.props.status == 6 ? <Text style={styles.text_1}>{strings('card_of_order.onRoad')}</Text> : 
                this.props.status == 7 ? <Text style={styles.text_1}>{strings('card_of_order.delivered')}</Text> : 
                <Text style={styles.text_1}>{strings('card_of_order.pending')}</Text>
              }
            </View>
            <View style={styles.track}>
              <Track width={143} status={this.props.status} language={this.props.language} percent={70}/>
            </View>
          </View>
          <Text style={styles.text_2}>{strings('card_of_order.order_number')}{this.props.number}</Text>
        </View>
        <View style={styles.order_inner_right}>
          <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
            <Text style={styles.text_b}>{this.props.money}</Text>
            <Text style={styles.text_b}>₪</Text>
          </View>
          <Text style={styles.text_2}>{this.props.date}</Text>
        </View>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  order_block: {
    width: 341,
    borderRadius: 10,
    height: 95,
    backgroundColor: "#242424",
    marginBottom: 12,
    paddingRight: 21,
    paddingLeft: 22,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revers_order_block: {
    width: 341,
    borderRadius: 10,
    height: 95,
    backgroundColor: "#242424",
    marginBottom: 12,
    paddingRight: 22,
    paddingLeft: 21,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',    
  },
  order_inner_left: {
    height: '100%',
    justifyContent: 'space-between',
  },
  order_inner_right: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  track: {
    marginTop: 11,
  },
  deliver_status:{
    flexDirection: 'row',
    justifyContent: 'flex-start',  
    alignItems: 'center',
  },
  revers_deliver_status:{
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',  
    alignItems: 'center',
  },
  deliver_icon: {
    marginRight: 8,
  },
  revers_deliver_icon: {
    marginLeft: 8,
  },
  text_b: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  text_1: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',   
  },
  text_2: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default CardOfOrder;