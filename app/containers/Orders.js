import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  ScrollView
} from 'react-native';
import { hideBeerAlert } from '../actions/actions';
import { connect } from 'react-redux';
import { strings } from '../locales/i18n';
import CardOfOrder from '../components/CardOfOrder';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';

class Orders extends Component {
    constructor(props){
    super(props);
    this.state = {
      orders: [],
      offset: 0,
      show_archive_button: true,
      old_orders: [],
      webSocketConnect: true,
    };
  }
  render(){
    if (this.state.webSocketConnect == true){
      return (
        <View style={styles.container}>
          {
            this.props.user.login_status == true ? 
              this.state.orders.length == 0 ?  <Text style={styles.white_text}>{strings('orders.not_yet')}</Text> : null
            : <Text style={styles.white_text}>{strings('orders.reg_or_login')}</Text>
          }
          <ScrollView style={styles.all_orders}>
           <View style={{flex: 1, alignItems: 'center',}}>
           <FlatList
              data={this.state.orders}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) =>
                <TouchableHighlight onPress={
                  () => Actions.order({
                    number: item.id, 
                    adres: item.address, 
                    price: item.price, 
                    created_at: item.created_at,
                    items: item.orderBeers,
                    lt: item.lt,
                    ln: item.ln,
                    status: item.status_id,
                  })
                }>
                  <View>
                   <CardOfOrder 
                     active={true} 
                     status={item.status_id} 
                     money={item.price} 
                     number={item.id} 
                     date={item.created_at}
                     language={this.props.language}
                   />
                  </View>
                </TouchableHighlight>
              }
            />
            <FlatList
              data={this.state.old_orders}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) =>
                <TouchableHighlight onPress={
                  () => Actions.order({
                    number: item.id, 
                    adres: item.address, 
                    price: item.price, 
                    created_at: item.created_at,
                    items: item.orderBeers,
                    lt: item.lt,
                    ln: item.ln,
                    status: item.status_id,
                  })
                }>
                  <View>
                   <CardOfOrder 
                      active={true} 
                      status={item.status_id} 
                      money={item.price} 
                      number={item.id} 
                      date={item.created_at}
                      language={this.props.language}
                    />
                  </View>
                </TouchableHighlight>
              }
            />
            {this.props.user.login_status == true && this.state.show_archive_button == true ?
              <View style={{marginTop: 15, marginBottom: 20}}>
                <TouchableHighlight onPress={this.getOldOrders}>
                  <Text style={{color: '#6d6d6d'}}>{strings('orders.archive')}</Text>
                </TouchableHighlight>
              </View> : null
            }
            </View>
          </ScrollView>
        </View>
      )
    }
    else {
      return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.white_text} >{strings('app.no_network')}</Text>
          <Spinner isVisible={true} size={58} type='ThreeBounce' color='#D80000'/>
        </View>
      )
    }
  }

  componentWillMount() {
    setTimeout(() => { this.props.dispatchHideBeerAlert(); }, 5000);
    this.connectToSocket();
  }

  connectToSocket = () => {
      var socket = new WebSocket('ws://beertime.acsima.com:1112');

      socket.onopen = () => {
        this.setState({webSocketConnect: true})
        if (this.props.user.login_status == true) {
          console.log('send')
          let data = JSON.stringify({
            cmd: 'userOrder',
            data: {user_id: this.props.user.user.id,}
          })
          socket.send(data);
        }
      };

      socket.onmessage = (e) => {
        let orders = JSON.parse(e.data);
        if (orders.cmd == 'userOrder' || orders.cmd == 'taken' || orders.cmd == 'done') {
          this.setState({orders: orders.data})
        }
      };

      socket.onerror = (e) => {
        this.setState({webSocketConnect: false})
      };

      socket.onclose = (e) => {
        // this.connectToSocket();
      };
  }

  getOldOrders = () => {
    fetch('http://beertime.acsima.com/api/order/archive', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        user_id: this.props.user.user.id,
        offset: this.state.offset,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({old_orders: this.state.old_orders.concat(responseJson)})
        if (responseJson.length < 10 ) {
          this.setState({show_archive_button: false})
        }
      })
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
    paddingTop: 5,
  },
  white_text: {
    color: '#FFFFFF',
    textAlign: 'center',
  }
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchHideBeerAlert: () => dispatch(hideBeerAlert()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Orders);