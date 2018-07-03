import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableHighlight,
} from 'react-native';

class ItemOfORder extends Component {
  render() {
    return(
      <View style={this.props.language == 'he' ? styles.reverse_item_block : styles.item_block}>
      	<View style={styles.cell}>
      		<Image source={{uri:'http://beertime.isf.in.ua/uploads/'+this.props.img+''}} style={{width: 67,height: 67, borderRadius: 15}}/>
      	</View>
      	<View style={this.props.language == 'he' ? styles.reverse_right_block : styles.right_block}>
      		<Text style={styles.text_b}>{this.props.language == 'he' ? this.props.name_he : this.props.name_ru}</Text>
      		<View style={styles.price}>
      			<View style={this.props.language == 'he' ? styles.reverse_liters_block : styles.liters_block}>
              <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
                <Text style={styles.text_2}>{this.props.liters}</Text>
                <Text style={styles.text_2}>L</Text>
              </View>
              <Text style={styles.cross}>x</Text>
              <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
                <Text style={styles.text_1}>{this.props.price}</Text>
                <Text style={styles.text_1}>₪</Text>
              </View>
      			</View>
            <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
              <Text style={styles.text_b}>{this.props.liters * this.props.price}</Text>
              <Text style={styles.text_b}>₪</Text>
            </View>
      		</View>
      	</View>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  item_block: {
  	width: '100%',
    borderRadius: 10,
  	height: 90,
  	backgroundColor: "#242424",
    marginBottom: 10,
    paddingRight: 23,
    paddingLeft: 14,
    paddingTop: 11,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  reverse_item_block: {
    width: '100%',
    borderRadius: 10,
    height: 90,
    backgroundColor: "#242424",
    marginBottom: 10,
    paddingRight: 14,
    paddingLeft: 23,
    paddingTop: 11,
    paddingBottom: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  cell: {
  	width: 67,
  	height: 67,
  	borderRadius: 15,
  	backgroundColor: '#ffffff',
  },
  right_block: {
  	flexDirection: 'column',
  	marginLeft: 15,
  	paddingTop: 8,
  	flex: 1,
  	height: 45,
  },
  reverse_right_block: {
    flexDirection: 'column',
    marginRight: 15,
    paddingTop: 8,
    flex: 1,
    height: 45,
  },
  price: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  },
  liters_block: {
  	flexDirection: 'row',
  	justifyContent: 'flex-start',
  },
  reverse_liters_block: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  text_b: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text_1: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold', 
    marginLeft: 3,  
  },
  cross: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold', 
    marginLeft: 3,
    marginRight: 3,
  },
  text_2: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  gray: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default ItemOfORder;