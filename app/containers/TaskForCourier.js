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
  FlatList,
} from 'react-native';
import { Beer_SVG, Drop_stroke_SVG, Check, Car_Black } from '../svg/SVG_Beer';
import {Actions} from 'react-native-router-flux';
import Dash from 'react-native-dash';
import ItemOfORder from '../components/ItemOfORder';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { connect } from 'react-redux';

class TaskForCourier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
  }
  componentWillMount(){
    this.props.app_state.socket.onmessage = (e) => {
      let orders = JSON.parse(e.data);
      if (orders.cmd == "done") {
        console.log('я тебя вижу')
      }
    };
  }

  OrderDone = async () => {
    // let id = await AsyncStorage.getItem('id_user');
    // console.log('курьер закончил работу' + id)
    let data = JSON.stringify({
      cmd: 'done',
      data: {order_id: this.props.order_id, id: this.props.user.user.id}
    })
    this.props.app_state.socket.send(data);
    await AsyncStorage.setItem('cour_status', 'without_work');
    Actions.reset('courier');
  }

  takeToWork = async () => {
    let status = await AsyncStorage.getItem('cour_status');
    // let id = await AsyncStorage.getItem('id_user');
    if (status == 'in_work') { alert('нельзя брать больше одного заказа') } else {
      navigator.geolocation.getCurrentPosition((position) => {
        let data = JSON.stringify({
          cmd: 'take',
          data: {
            order_id: this.props.order_id, 
            id: this.props.user.user.id, 
            cour_lt: position.coords.latitude, 
            cour_ln: position.coords.longitude }
        })
        this.props.app_state.socket.send(data);
        this.start();
      })
      Actions.reset('courier');
    }
  }
  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'BeerTime',
      notificationText: 'Background tracking',
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: 'http://beertime.isf.in.ua/api/usergetcoordinates',
      httpHeaders: {
        'X-FOO': 'bar'
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        id: this.props.user.user.id // you can also add your own properties
      }
    });
  }

  start = () => {
    BackgroundGeolocation.start();
  }

  stop = () => {
    BackgroundGeolocation.stop();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.all_orders}>
          <View style={{paddingLeft: 10, paddingRight: 10}}> 
            <Text style={styles.bold}>Заказ №{this.props.order_id}</Text>
            <View style={[styles.price, {marginTop: 12}]}>
              <View style={styles.price}>
                <View style={styles.beer_icon}>
                { this.props.active == true ? <Beer_SVG color="#D80000" height={19} width={16}/> : <Beer_SVG color="#FFFFFF" height={19} width={16}/>}
                </View>
                { this.props.active == true ? <Text style={styles.sm_bold}>Взят в работу</Text> : <Text style={styles.sm_bold}>Ожидает доставки</Text>}
              </View>
              <Text style={styles.gray}>{this.props.created_at}</Text>
            </View>
            <View style={[styles.price, {marginTop: 15}]}>
              <Text style={styles.gray}>{this.props.user_name} {this.props.second_name}</Text>
              <Text style={styles.gray}>{this.props.phone}</Text>
            </View>
            <View style={[styles.price, {marginTop: 6, marginBottom: 11}]}>
              {this.props.pay_id == null ? 
                <Text style={styles.gray}>Оплата при доставке</Text>: 
                <Text style={styles.gray}>Оплата онлайн — Оплачено</Text>}
              <Text style={styles.bold}>{this.props.price} ₪</Text>
            </View>
          </View>
          <FlatList
            data={this.props.orderBeers}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) =>
              <ItemOfORder
                name_ru={item.name_ru}
                name_he={item.name_he}
                liters={item.liters}
                price={item.price}
                img={item.img}
              />
            }
          />
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.gray}>Адрес доставки</Text>
          <Text style={styles.sm_bold}>{this.props.address}</Text>
          <View style={styles.button_panel}>
            <TouchableHighlight onPress={() => Actions.in_map_for_courier({
              ln: this.props.ln,
              lt: this.props.lt,
              active: this.props.active,
              address: this.props.address,
              number: this.props.order_id,
              price: this.props.price,
            })}>
              <View style={styles.on_map_button}>
                <Drop_stroke_SVG/>
                <Text style={styles.red_text}>На карте</Text>
              </View>
            </TouchableHighlight>
            { this.props.active == true ?
            <TouchableHighlight onPress={this.OrderDone}>
              <View style={styles.red_button}>
                <Check/>
                <Text style={styles.bold_text}>Доставлено</Text>
              </View>
            </TouchableHighlight>
             :
            <TouchableHighlight onPress={this.takeToWork}>
              <View style={styles.red_button_car}>
                <Car_Black/>
                <Text style={styles.bold_text}>В работу</Text>
              </View>
            </TouchableHighlight>
            }
          </View>
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
  price: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  },
  beer_icon: {
    marginRight: 10,
  },
  button_panel: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gray: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  bold: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sm_bold: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  red_text: {
    color: '#D80000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bold_text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    height: 132,
    backgroundColor: '#0C0C0C',
    paddingTop: 12,
    paddingLeft: 22,
    paddingRight: 20,
  },
  on_map_button: {
    borderWidth: 1,
    borderColor: '#D80000',
    borderRadius: 30,
    width: 134,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  red_button: {
    borderRadius: 30,
    width: 160,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D80000',
    paddingLeft: 20,
    paddingRight: 16,
  },
  red_button_car: {
    borderRadius: 30,
    width: 147,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D80000',
    paddingLeft: 23,
    paddingRight: 23,
  },
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps) (TaskForCourier);