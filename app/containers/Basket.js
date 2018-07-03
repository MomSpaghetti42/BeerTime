import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
import { strings } from '../locales/i18n';
import { Basket_SVG }from '../svg/SVG_Beer';
import { decrease } from '../actions/actions';

class Item extends Component {
  render() {
    return(
      <View style={ this.props.language == 'he' ? styles.revers_item_block : styles.item_block }>
        <View style={styles.cell}>
          <Image source={{uri:''+this.props.img+''}} style={{width: 67,height: 67, borderRadius: 15}}/>
        </View>
        <View style={[
          styles.right_block, 
          this.props.language == 'he' ? {marginRight: 15, alignItems: 'flex-end',} : {marginLeft: 15, alignItems: 'flex-start',}
          ]}
        >
          <Text style={styles.text_b}>{this.props.language == 'he' ? this.props.name_he : this.props.name_ru}</Text>
          <View style={ this.props.language == 'he' ? styles.reverse_price : styles.price }>
            <View style={[
                  styles.counter, 
                  this.props.language == 'ru' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'}
                ]}
              >
              <TouchableHighlight onPress={() => this.props.Count(this.props.id, 'decrease')}>
                <View style={styles.count_button}>
                  <Text style={styles.red_plus}>–</Text>
                </View>
              </TouchableHighlight>
              <Text style={styles.amount}>{this.props.amount}</Text>
              <TouchableHighlight  onPress={() => this.props.Count(this.props.id, 'increase')}>
                <View style={styles.count_button}>
                  <Text style={styles.red_plus}>+</Text>
                </View>
              </TouchableHighlight>
            </View>
            <TouchableHighlight style={{marginRight: 10, marginLeft: 10}} onPress={() => this.props.Count(this.props.id, 'delete')}>
              <View style={styles.button_clear}>
                <Text style={styles.red_plus}>×</Text>
              </View>
            </TouchableHighlight>
            <Text style={styles.text_b}>{(this.props.price * this.props.amount).toFixed(2)} ₪</Text>
          </View>
        </View>
      </View>
      )
  }
}
class Basket extends Component {
  async getSells() {
    let response = await AsyncStorage.getItem('purches');
    let purches = await JSON.parse(response)
    if (purches != null && purches != []){
      let all = purches.reduce(function(sum, current) {
          return sum + (+current.price * current.liters);
        }, 0);
      this.setState({'purches' : purches , 'all' : all});
    }
  }
  constructor(props){
    super(props);
    this.state = {
      purches: '',
      all: '',
    };
  }
  componentWillMount(){
    this.getSells()
  }
  _Count = async (id, action) => {
    var new_parches
    switch(action) {
      case 'increase': 
        new_parches = this.state.purches.map(item => {
          if ( item.id == id ) { 
            item.liters = item.liters + 1;
            this.setState({'all' : this.state.all + +item.price}); 
          } 
          else null
          return item
        })
        break;
      case 'decrease':  
        new_parches = this.state.purches.map(item => {
          if ( item.id == id ) { 
            item.liters > 1 ? item.liters = item.liters - 1  : null; 
          } 
          else null;
          return item
        })
        break;
      case 'delete':
        new_parches = this.state.purches.filter((item) => item.id == id ? null : item);
        this.props.dispatchDecrease();
        break;
      default:
        break;
    }
    await AsyncStorage.setItem('purches', JSON.stringify(new_parches));
    this.setState({'purches' : new_parches});
    let all = new_parches.reduce(function(sum, current) {
      return sum + (+current.price * current.liters);
    }, 0);
    this.setState({'purches' : new_parches , 'all' : all});
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.all_orders}>
          <FlatList
            data={this.state.purches}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) =>
              <TouchableHighlight onPress={this.pressOn}>
                <View>
                  <Item 
                    name_ru={item.name_ru} 
                    name_he={item.name_he} 
                    price={item.price} 
                    amount={item.liters} 
                    img={item.img}
                    id={item.id}
                    Count={this._Count}
                    language={this.props.language}
                  />
                </View>
              </TouchableHighlight>
            }
          />
        </ScrollView>
        <Text style={{color: '#FFFFFF'}}></Text>
        <View style={styles.footer}>
          <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
            <Text style={styles.sum_text}>{this.state.all}</Text>
            <Text style={styles.sum_text}>₪</Text>
          </View>
          <TouchableHighlight onPress={() => Actions.ordering({purches: this.state.purches, all_price: this.state.all})}>
            <View style={styles.buy_button}>
              <Basket_SVG height={21} width={21} color={'#000000'}/>
              <Text style={styles.black_text}>{strings('basket.ordering')}</Text>
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  revers_item_block: {
    width: '100%',
    borderRadius: 10,
    height: 90,
    backgroundColor: "#242424",
    marginBottom: 10,
    paddingRight: 14,
    paddingLeft: 23,
    paddingTop: 11,
    paddingBottom: 12,
    justifyContent: 'flex-start',
    flexDirection: 'row-reverse',
  },
  cell: {
    width: 67,
    height: 67,
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
  right_block: {
    flexDirection: 'column',
    paddingTop: 8,
    flex: 1,
    height: 45,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  reverse_price: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  counter: {
    borderWidth: 1,
    borderColor: '#505050',
    borderRadius: 30,
    width: 110,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
  text_b: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
  red_plus: {
    color: '#D80000',
    fontSize: 18,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  button_clear: {
    borderWidth: 1,
    borderColor: '#505050',
    borderRadius: 30,
    width: 32,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    width: '100%',
    height: 88,
    backgroundColor: '#0C0C0C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 26,
    paddingLeft: 26,
  },
  sum_text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buy_button: {
    width: 154,
    height: 40,
    backgroundColor: '#D80000',
    borderRadius: 30,
    paddingLeft: 26,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  black_text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  count_button: {
    alignItems: 'center',
    width: 24,
  },
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchDecrease: () => dispatch(decrease()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Basket)