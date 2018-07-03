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
import { Beer_SVG, Drop_in_Cir, Car_in_Cir } from '../svg/SVG_Beer';

class CardOfOrderForCourier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'waiting',
      address: ''
    };
  }
  render() {
    return(
      <View style={[styles.order_block, this.props.active == false ? {backgroundColor: "#242424"} : {backgroundColor: "#990000"}]}>
        <View style={styles.order_inner_left}>
          <Text style={styles.bold_mid_text}>{this.props.address != null ? this.props.address.substr(0, 25) : null}</Text>
          <Text style={styles.norm_sml_text}>Заказ №{this.props.number}</Text>
          <View style={styles.block}>
            <View style={{marginRight: 8}}>
              <Beer_SVG color="#FFFFFF" height={15} width={13}/>
            </View>
            {this.props.active == false ? <Text style={styles.bold_sml_text}>Ожидает доставку</Text> : <Text style={styles.bold_sml_text}>Взят в работу</Text>}
          </View>
        </View>
        <View style={styles.order_inner_right}>
          {this.props.active == false ? <Car_in_Cir/> : <Drop_in_Cir/>}
          <Text style={styles.bold_text}>{this.props.money} ₪</Text>
        </View>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  order_block: {
    width: '100%',
    borderRadius: 10,
    height: 105,
    marginBottom: 12,
    paddingRight: 23,
    paddingLeft: 22,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: 'row',
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
  bold_text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bold_mid_text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bold_sml_text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  norm_sml_text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  block: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default CardOfOrderForCourier;