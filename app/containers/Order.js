import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Beer_SVG, Drop_SVG, Track, Clock_SVG } from '../svg/SVG_Beer';
import Dash from 'react-native-dash';
import ItemOfORder from '../components/ItemOfORder';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { showAlert } from '../actions/actions';
import { connect } from 'react-redux';
import { strings } from '../locales/i18n';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state= {
      modal: false,
      review: '',
    };
  }

  leaveReview = () => {
    fetch('http://beertime.acsima.com/api/order/review', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        id: this.props.number,
        review: this.state.review,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if ( responseJson.success == true ) {
        this.props.dispatchShowAlert(strings('order.success'));
      }
    })
    .then(() => {
      this.setState({modal: false})
    })
  }

  changeReview = (value) => {
    this.setState({review:value});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.all_orders}>
          <View style={{paddingLeft: 10, paddingRight: 10}}> 
            <Text style={styles.order_text}>{strings('order.order_number')}{this.props.number}</Text>
            <View style={this.props.language == 'he' ? styles.reverse_price : styles.price}>
              <Text style={styles.gray}>{this.props.adres}</Text>
              <Text style={styles.gray}>{this.props.created_at}</Text>
            </View>
            <View style={styles.status_block}>
              <View style={styles.price}>
                {
                  this.props.status == 6 ? <Beer_SVG color="#D80000" height={15} width={13}/> : 
                  this.props.status == 7 ? <Beer_SVG color="#6d6d6d" height={15} width={13}/> : 
                  <Clock_SVG />
                }
                {
                  this.props.status == 6 ? <Text style={styles.text_icon}>{strings('order.onRoad')}</Text> : 
                  this.props.status == 7 ? <Text style={styles.text_icon}>{strings('order.delivered')}</Text> : 
                  <Text style={styles.text_icon}>{strings('order.pending')}</Text>
                }
              </View>
              <TouchableHighlight onPress={() => Actions.in_map({
                lt: this.props.lt, 
                ln:this.props.ln,
                status: this.props.status,
                price: this.props.price,
                created_at: this.props.created_at,
                number: this.props.number,
              })}>
                <View style={styles.price}>
                  <Drop_SVG/>     
                    <View style={{marginLeft: 10}}>         
                      <Text style={styles.text_icon_drop}>{strings('order.on_map')}</Text>
                      <Dash style={{width:'100%', height:1}} dashColor="#D80000" dashLength={3}/>
                    </View>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.slider}>
              <Track width={321} status={this.props.status} language={this.props.language} percent={70}/>
            </View>
          </View>
          <FlatList
              data={this.props.items}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) =>
                <ItemOfORder
                  name_ru={item.name_ru}
                  name_he={item.name_he}
                  liters={item.liters}
                  price={item.price}
                  img={item.img}
                  language={this.props.language}
                />
              }
            />
          <View style={this.props.language == 'he' ? styles.reverse_sum_block : styles.sum_block}>
            <Text style={styles.vsego}>{strings('order.all')}</Text>
            <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
              <Text style={styles.sum}>{this.props.price}</Text>
              <Text style={styles.sum}>₪</Text>
            </View>
          </View>
          { this.props.status == 7 ?
            <View style={styles.button_panel}>
              <TouchableHighlight onPress={() => this.setState({modal: true})}>
                <View style={styles.button_enter}>
                  <Text style={styles.button_text}>{strings('order.leave_review')}</Text>
                </View>
              </TouchableHighlight>
            </View> : null
          }
        </ScrollView>
        <Modal
          visible={this.state.modal}
          animationType={'fade'}
          onRequestClose={() => this.setState({modal: false})}
          transparent={true}
        >
          <View style={styles.alert_overlay}>
            <View style={styles.commentModal_block}>
              <Text style={styles.commentModal_text}>{strings('order.review_about')}</Text>
              <Text style={styles.commentModal_text2}>{strings('order.review')}</Text>
              <AutoGrowingTextInput 
                style={styles.textInput} 
                placeholder={strings('order.your_review')}
                selectionColor="#FFFFFF"
                underlineColorAndroid='#FFFFFF'
                autoFocus={this.state.modal}
                placeholderTextColor='rgba(255, 255, 255, 0.4)'
                onChangeText={(value) => this.changeReview(value)}
                maxLength={320}
              />
              <View style={styles.button_panel}>
                <TouchableHighlight onPress={this.leaveReview}>
                  <View style={styles.button_enter}>
                    <Text style={styles.button_text}>{strings('order.save')}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  all_orders: {
    flex: 1,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
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
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  reverse_price: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  liters_block: {
    flexDirection: 'row',
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
  text_2: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  sum_block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  reverse_sum_block: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  vsego: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    lineHeight: 21,
  },
  sum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 21,
  },
  order_text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 8,
    marginBottom: 12,
  },
  gray: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  status_block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 23,
    marginBottom: 19,
  },
  slider: {
    alignItems: 'center',
    marginBottom: 30,
  },
  text_icon: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  text_icon_drop: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
  underline: {
    borderBottomColor: '#D80000',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  button_panel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 18,
    marginBottom: 24,
  },
  button_enter: {
    borderColor: '#D80000',
    borderWidth: 1,
    borderRadius: 30,
    width: 149,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alert_overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.6)',
  },
  alert_text: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 5,
  },
  commentModal_block: {
    width: '90%',
    minHeight: 217,
    backgroundColor: '#0C0C0C',
    borderRadius: 15,
    paddingLeft: 18,
    paddingRight: 18,
  },
  commentModal_text: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 14,
  },
  commentModal_text2: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 14,
  },
  alert_block: {
    width: 200,
    height: 100,
    backgroundColor: '#0C0C0C',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchShowAlert: (text) => dispatch(showAlert(text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Order);