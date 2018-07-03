import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  FlatList,
  AsyncStorage,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import CardOfOrderForCourier from '../components/CardOfOrderForCourier';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { connect } from 'react-redux';
import Spinner from 'react-native-spinkit';

class Courier extends Component {
  constructor(props){
    super(props);
    this.state = {
      in_progress: this.props.in_progress,
      pending: this.props.pending,
      network: this.props.app_state.network,
    };
  }
  componentWillMount(){
    if (this.props.app_state.socket.readyState === this.props.app_state.socket.OPEN) {

    }
    else {
      this.setState({network: false})
    }
    this.props.app_state.socket.onmessage = (e) => {
      let orders = JSON.parse(e.data);
      if (orders.cmd == "connected_courier" || orders.cmd == "done" || orders.cmd == "changed") {
        this.setState({in_progress: orders.data.in_progress, pending: orders.data.pending});
        if (orders.data.in_progress.length == 0) {
          console.log('pustoi')
        } 
        else {
          this.setStatus()
        }
        if (orders.cmd == "done") {
          BackgroundGeolocation.stop();
        }
      }
    };
  }
  setStatus = async () => {
    await AsyncStorage.setItem('cour_status', 'in_work');
  }
  render() {
    if (this.state.network == true){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.all_orders}>
            <FlatList
              data={this.state.in_progress}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) =>
                <TouchableHighlight onPress={() => Actions.task_for_courier({
                  active: true, 
                  order_id: item.id, 
                  address: item.address,
                  ln: item.ln,
                  lt: item.lt,
                  user_name: item.user.name,
                  second_name: item.user.second_name,
                  phone: item.order_phone,
                  price: item.price,
                  pay_id: item.pay_id,
                  created_at: item.created_at,
                  orderBeers: item.orderBeers,
                })}>
                  <View>
                    <CardOfOrderForCourier active={true} money={item.price} number={item.id} date={item.date} address={item.address}/>
                  </View>
                </TouchableHighlight>
              }
            />
            <FlatList
              data={this.state.pending}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) =>
                <TouchableHighlight onPress={() => Actions.task_for_courier({
                  active: false,
                  order_id: item.id, 
                  address: item.address,
                  ln: item.ln,
                  lt: item.lt,
                  user_id: item.user_id,
                  user_name: item.user.name,
                  second_name: item.user.second_name,
                  phone: item.order_phone,
                  price: item.price,
                  pay_id: item.pay_id,
                  created_at: item.created_at,
                  orderBeers: item.orderBeers,
                })}>
                  <View>
                    <CardOfOrderForCourier active={false} money={item.price} number={item.id} date={item.date} address={item.address}/>
                  </View>
                </TouchableHighlight>
              }
            />
          </ScrollView>
        </View>
      )
    }
    else {
      return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.white_text} >Нет сети</Text>
          <Spinner isVisible={true} size={58} type='ThreeBounce' color='#D80000'/>
        </View>
      )
    }
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
  white_text: {
    color: '#FFFFFF',
    textAlign: 'center',
  }
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps) (Courier);