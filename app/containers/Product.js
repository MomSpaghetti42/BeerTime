import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  AsyncStorage,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomInput from '../components/CustomInput';
import { Basket_SVG }from '../svg/SVG_Beer';
import Spinner from 'react-native-spinkit';
import { connect } from 'react-redux';
import { increase } from '../actions/actions';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { strings } from '../locales/i18n';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state= {
      amount: 1,
      showAlert: false,
      commentModal: false,
      review: '',
      offset: 1,
      showMoreButton: true,
    };
  }
  _Order = () => {
    Actions.ordering({
      purches: [{
        id: this.props.product_id,
        name_ru: this.props.product_name_ru, 
        name_he: this.props.product_name_he, 
        price: this.props.product_price, 
        liters: this.state.amount, 
        img: this.props.product_img,
      }], 
      all_price: this.props.product_price * this.state.amount,
    })
  }
  _addToBasket = async () => {
    this.setState({showAlert: true})
    let response = await AsyncStorage.getItem('purches');
    if (response == null) {
      await AsyncStorage.setItem('purches', JSON.stringify([
        {
        'id': this.props.product_id, 
        name_ru: this.props.product_name_ru, 
        name_he: this.props.product_name_he, 
        price: this.props.product_price, 
        liters: this.state.amount, 
        img: this.props.product_img,},
      ]));
      this.props.dispatchIncrease();
      this.setState({showAlert: false})
    }
    else {
      let purches = JSON.parse(response)
      let neww = purches.some(item => (item.id == this.props.product_id));
      if (neww == true) {
        purches = purches.map(item => {
          item.id == this.props.product_id ? item.liters = item.liters + this.state.amount : null;
          return item
        } )
      }
      else {
        purches.push({
          'id': this.props.product_id, 
          name_ru: this.props.product_name_ru, 
          name_he: this.props.product_name_he,  
          price: this.props.product_price, 
          liters: this.state.amount, 
          img: this.props.product_img,
        })
        this.props.dispatchIncrease();
      }
      await AsyncStorage.setItem('purches', JSON.stringify(purches));
      this.setState({showAlert: false})
    }
  }

  _increase = () => {
    this.setState({amount: this.state.amount + 1});
  };

  _decrease = () => {
    this.state.amount == 1 ? null : this.setState({amount: this.state.amount - 1});
  }

  getComents = () => {
    fetch('http://beertime.acsima.com/api/reviews', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        beer_id: this.props.product_id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({ comments: responseJson.reviews });
      this.setState({ visible_comments: responseJson.reviews.slice(0, 2) })
    })
  }

  ShowMoreComments = () => {
    if ( this.state.comments.length - this.state.visible_comments.length <= 10 ) {
      console.log(this.state.comments.length - this.state.visible_comments.length);
      this.setState({ visible_comments: this.state.comments, showMoreButton: false })
    }
    else {
      this.setState({ 
        visible_comments: this.state.comments.slice(0, this.state.offset * 10), 
        offset:  this.state.offset + 1,
      })
    }
  }

  changeReview = (value) => {
    this.setState({review:value});
  }

  leaveСomment = () => {
    fetch('http://beertime.isf.in.ua/api/review/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        beer_id: this.props.product_id,
        user_id: this.props.user.user.id,
        review: this.state.review,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ visible_comments: responseJson.reviews.slice(0, this.state.offset * 10) })
    })
    .then(() => {
      this.setState({commentModal: false})
    })
    .catch(() => {
      this.setState({commentModal: false})
    });
  }
  componentWillMount() {
    this.getComents()
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.main}>
          <View style={styles.image}>
            <Image source={{uri:''+this.props.product_img+''}} style={{width: 306,height: 341, borderRadius: 20}}/>
          </View>
          <View style={this.props.language == 'he' ? {marginBottom: 12, alignItems: 'flex-end'} : {marginBottom: 12, alignItems: 'flex-start'} }>
            <Text style={styles.beer_name}>{this.props.language == 'ru' ? this.props.product_name_ru : this.props.product_name_he}</Text>
            <Text style={[styles.text, {marginBottom: 11}]}>{strings('product.country')}{this.props.country}</Text>
            <Text style={styles.text}>{this.props.language == 'ru' ? this.props.product_descrip_ru : this.props.product_descrip_he}</Text>
          </View>
          <View>
            <Text style={[styles.white, {marginBottom: 13}]}>{strings('product.reviews')}</Text>
            <FlatList
              data={this.state.visible_comments}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) =>
                <View style={styles.coment_block}>
                  <View style={[
                      styles.simple_block, 
                      this.props.language == 'ru' ? {flexDirection: 'row', marginBottom: 5} : {flexDirection: 'row-reverse', marginBottom: 5}
                    ]}
                  >
                    <Text style={styles.white}>
                      {
                        item.user_second_name != null ? 
                        item.user_name +' '+ item.user_second_name 
                        : item.user_name
                      }
                    </Text>
                    <Text style={styles.text}>{item.just_date}</Text>
                  </View>
                  <Text style={styles.text}>{item.review}</Text>
                </View>
              }
            />
            { this.state.showMoreButton == true ?
              <TouchableHighlight onPress={this.ShowMoreComments} style={{marginBottom: 15}}>
                <Text style={styles.more_comments}>{strings('product.more_reviews')}</Text>
              </TouchableHighlight> : 
              null
            }
            <TouchableHighlight onPress={ () => this.setState({ commentModal: true }) }>
              <Text style={styles.red_text}>{strings('product.leave_review')}</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <View style={styles.footer}>

          <View style={[
                styles.simple_block, 
                this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
              ]}
            >
            <View style={[
                styles.simple_block, 
                this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
              ]}
            >
              <View style={[
                  styles.counter, 
                  this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
                ]}
              >
                <TouchableHighlight onPress={this._decrease}>
                  <View style={styles.butt}>
                    <Text style={styles.red_plus}>–</Text>
                  </View>
                </TouchableHighlight>
                <Text style={styles.amount}>{this.state.amount}</Text>
                <TouchableHighlight onPress={this._increase}>
                  <View style={styles.butt}>
                    <Text style={styles.red_plus}>+</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={[
                  styles.multiplier, 
                  this.props.language == 'ru' ? {marginTop: 16, flexDirection: 'row'} : {marginTop: 16, flexDirection: 'row-reverse'}
                ]}
              >
                <Text style={styles.multiplier_text}>×</Text>
                <Text style={[styles.multiplier_text, {marginRight: 3, marginLeft: 3}]}>{this.props.product_price}</Text>
                <Text style={styles.multiplier_text}>₪</Text>
              </View>
            </View>
            <View style={this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}}>
              <Text style={styles.sum_text}>{(this.props.product_price * this.state.amount).toFixed(2)}</Text>
              <Text style={[styles.sum_text, {marginLeft: 3, marginRight: 3}]}>₪</Text>
            </View>
          </View>
          {this.props.user.login_status == true ? 
            <View style={[
                styles.simple_block, 
                this.props.language == 'ru' ? {marginTop: 16, flexDirection: 'row'} : {marginTop: 16, flexDirection: 'row-reverse'}
              ]}
            >
              <TouchableHighlight onPress={this._addToBasket}>
                <View style={[styles.in_basket, {borderColor: '#D80000'}]}>
                  <Basket_SVG height={21} width={21} color={'#D80000'}/>
                  <Text style={[styles.red_text_button, {color: '#D80000'}]}>{strings('product.in_basket')}</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._Order}>
                <View style={[styles.buy_button, {backgroundColor: '#D80000',}]}>
                  <Basket_SVG height={21} width={21} color={'#000000'}/>
                  <Text style={styles.black_text}>{strings('product.buy')}</Text>
                </View>
              </TouchableHighlight>
            </View> :

            <View style={[
                styles.simple_block, 
                this.props.language == 'ru' ? {marginTop: 16, flexDirection: 'row'} : {marginTop: 16, flexDirection: 'row-reverse'}
              ]}
            >
              <TouchableHighlight onPress={() => {alert('Залогинтесь')}}>
                <View style={[styles.in_basket, {borderColor: '#616161'}]}>
                  <Basket_SVG height={21} width={21} color={'#616161'}/>
                  <Text style={[styles.red_text_button, {color: '#616161'}]}>{strings('product.in_basket')}</Text>
                </View>
              </TouchableHighlight>
              <View style={[styles.buy_button, {backgroundColor: '#616161',}]}>
                <Basket_SVG height={21} width={21} color={'#000000'}/>
                <Text style={styles.black_text}>{strings('product.buy')}</Text>
              </View>
            </View>
          }
        </View>
        <Modal
          visible={this.state.showAlert}
          animationType={'fade'}
          onRequestClose={() => this.closeModal()}
          transparent={true}
        >
          <View style={styles.alert_overlay}>
            <View style={styles.alert_block}>
              <Text style={styles.alert_text}>{strings('product.added')}</Text>
              <Spinner isVisible={true} size={38} type='ThreeBounce' color='#D80000'/>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.commentModal}
          animationType={'fade'}
          onRequestClose={() => this.setState({commentModal: false})}
          transparent={true}
        >
          <View style={styles.alert_overlay}>
            <View style={styles.commentModal_block}>
              <Text style={styles.commentModal_text}>{strings('product.review_about')}</Text>
              <Text style={styles.commentModal_text2}>{strings('product.review')}</Text>
              <AutoGrowingTextInput 
                style={styles.textInput} 
                placeholder={'Ваш отзыв о пиве'} 
                selectionColor="#FFFFFF"
                underlineColorAndroid='#FFFFFF'
                autoFocus={this.state.commentModal}
                placeholderTextColor='rgba(255, 255, 255, 0.4)'
                onChangeText={(value) => this.changeReview(value)}
                maxLength={320}
              />
              <View style={styles.button_panel}>
                <TouchableHighlight onPress={this.leaveСomment}>
                  <View style={styles.button_enter}>
                    <Text style={styles.button_text}>{strings('product.save')}</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    width: '100%',
    paddingLeft: 24,
    paddingRight: 30,
  },
  image: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 23,
  },
  coment_block: {
    height: 50,
    marginBottom: 22,
  },
  simple_block: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    height: 137,
    backgroundColor: '#0C0C0C',
    justifyContent: 'center',
    paddingRight: 26,
    paddingLeft: 26,
  },
  sum_text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buy_button: {
    width: 140,
    height: 40,
    borderRadius: 30,
    paddingLeft: 24,
    paddingRight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  in_basket: {
    width: 154,
    height: 40,
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  black_text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  red_text_button: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  beer_name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  white: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  red_text: {
    color: '#D80000',
    fontSize: 16,
    marginBottom: 22,
  },
  counter: {
    borderWidth: 1,
    borderColor: '#505050',
    borderRadius: 30,
    width: 110,
    height: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  red_plus: {
    color: '#D80000',
    fontSize: 18,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  butt: {
    width: 42,
    alignItems: 'center',
  },
  multiplier: {
    justifyContent: 'center',
    marginLeft: 12,
    height: 32,
  },
  multiplier_text: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  more_comments: {
    color: 'rgba(255, 255, 255, 0.8)',
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
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchIncrease: () => dispatch(increase()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Product);