import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  AsyncStorage,
  TouchableHighlight,
  Modal,
  Keyboard,
  Alert,
  Picker,
  WebView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { reset, showAlert, showBeerAlert } from '../actions/actions';

import { Caret } from '../svg/SVG_Beer';
import CustomInput from '../components/CustomInput';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-spinkit';
import BTClient from 'react-native-braintree-xplat';
import { strings } from '../locales/i18n';

class Ordering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      latitude: 31.7678093,
      longitude: 35.1756789,
      tap_adress: '',
      showAlert: false,
      wrong_alert: false,
      phone: this.props.user.user.phone,
      latitudeDelta: 0.0030,
      longitudeDelta: 0.0030,
      pay_modal: false,
    };
  }

  _Order = async () => {
    if (this.state.adres == null || this.state.adres == undefined ) {
      this.props.dispatchShowAlert('Укажите адресс');
    }
    else
    {
      this.setState({showAlert: true});
        fetch('http://beertime.acsima.com/api/order/create', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            user_id: this.props.user.user.id, 
            phone: this.state.phone, 
            lt: this.state.latitude, 
            ln: this.state.longitude,
            address: this.state.adres,
            beers : this.props.purches,
            price: this.props.all_price,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.success ==  true) {
            AsyncStorage.setItem('purches', '');
            this.props.dispatchReset();
            this.setState({showAlert: false});
            this.props.dispatchShowBeerAlert();
            Actions.reset("tabbar");
          } else{
            this.setState({wrong_alert: true})
            this.setState({showAlert: false});
          }
        })
        .catch((error) => {
          this.props.dispatchShowAlert('Пробемы с сетью');
        });
      }
  }
  _Order_Braintree = () => {
    let product_name = this.props.purches.map(item => item.name_ru);
    let product_name_str = JSON.stringify(product_name);
    fetch('https://preprod.paymeservice.com/api/generate-sale', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        'seller_payme_id': 'MPL15286-93229G54-366HTTTA-KYXCEN4T',
        'sale_price': +this.state.sale_price,
        'currency': 'ILS',
        'product_name': product_name_str,
        // 'transaction_id': '12345',
        // 'installments': 1,
        'sale_callback_url': 'http://www.example.com/payment/callback',
        'sale_return_url': 'http://www.example.com/payment/success',
        'capture_buyer': 0,
        'language': 'en',
        'sale_email': this.props.user.user.email,
        'sale_mobile': this.props.user.user.phone
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({url: responseJson.sale_url})
    })
    .then(() => {
      this.setState({pay_modal: true})
    })
  }

  _onNavigationStateChange(webViewState){
    console.log(webViewState);
  }

  changeTextPhone = (value) => {
    this.setState({phone:value});
  }
  changeTextAdres = (value) => {
    this.setState({adres:value});
  }
  _openModal = () => {
    this.setState({modalVisible: true});
    Keyboard.dismiss();
  }
  getLocation = (longitude, latitude) => {
    var Coordinate = {
      lat: latitude,
      lng: longitude
    };
    this.setState({lt: latitude, ln: longitude})
    Geocoder.geocodePosition(Coordinate).then(res => {
        let area = res[0].subAdminArea == null ? '' : res[0].subAdminArea;
        let streetName = res[0].streetName == null ? '' : res[0].streetName;
        let streetNumber = res[0].streetNumber == null ? '' : res[0].streetNumber;
        let adress = area + ' ' + streetName + ' ' + streetNumber;
        this.refs.businessaddress.setAddressText(adress);
        this.setState({adres: adress});
    })
    .catch(err => console.log(err))
  }
  componentDidMount() {
    if ( this.props.all_price % 1 == 0 ) {
      this.setState({sale_price: this.props.all_price})
    } 
    else {
      this.setState({sale_price: (this.props.all_price*100).toFixed()})
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({longitude: position.coords.longitude, latitude: position.coords.latitude})
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.login_block}>
          <View style={styles.login_form}>
            <Text style={styles.simple_text}>{strings('ordering.phone')}</Text>
            <CustomInput 
              rtl={this.props.language == "he" ? true : false}
              placeholder={strings('ordering.phone_place')} 
              value={this.state.phone} 
              onChangeText={this.changeTextPhone} 
              keyboardType="phone-pad"
            />
            <Text style={styles.simple_text}>{strings('ordering.address')}</Text>
            <CustomInput 
              placeholder={strings('ordering.address_place')} 
              value={this.state.adres} 
              onChangeText={this.changeTextAdres} 
              keyboardType="default"
              onFocus={this._openModal}
            />
            <Text style={styles.simple_text}>{strings('ordering.pay')} </Text>
            <View style={styles.input_box_picker}>
              <Picker
                selectedValue={this.state.payment}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({payment: itemValue})}>
                <Picker.Item label={strings('ordering.on_deliver')}  value="delivering" />
                <Picker.Item label={strings('ordering.card')}  value="card" />
              </Picker>
              <View 
                style={[
                  styles.caret,
                  this.props.language == 'he' ? {left: 12} : {right: 12},
                ]} 
              >
                <Caret/>
              </View>
            </View>
          </View>
          <View style={[
            styles.button_panel,
            this.props.language == 'he' ? {justifyContent: 'flex-start'} : {justifyContent: 'flex-end'}
            ]}
          >
            <TouchableHighlight onPress={this.state.payment == 'card' ? this._Order_Braintree : this._Order} >
              <View style={styles.button_enter}>
                <Text style={styles.button_text}>{strings('ordering.order')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

        <Modal
            visible={this.state.modalVisible}
            animationType={'fade'}
            onRequestClose={() => this.setState({modalVisible:false})}
            transparent={true}
        >
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
            <MapView
              localizesLabels={true}
              style={{width: '100%', height: '100%', position: 'absolute',}}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: this.state.latitudeDelta,
                longitudeDelta: this.state.longitudeDelta,
              }}
              onPress={(e) => {
                this.setState({
                  longitude: e.nativeEvent.coordinate.longitude, 
                  latitude: e.nativeEvent.coordinate.latitude})
                  this.getLocation(e.nativeEvent.coordinate.longitude, e.nativeEvent.coordinate.latitude);
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                image={require('../img/marker.png')}
              />
            </MapView>
            <View style={{width: '96%', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
              <GooglePlacesAutocomplete
                placeholder={strings('ordering.put_address')}
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                ref='businessaddress'
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                  this.setState({
                    latitude: details.geometry.location.lat, 
                    longitude: details.geometry.location.lng, 
                    adres: details.name 
                  });
                }}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb'
                  },
                }}
                currentLocation={false}
                query={{
                  key: 'AIzaSyA9Z6u5B0_FkMnpN8NuqEGyfXecY0aWagA',
                  language: this.props.language,
                  types: 'geocode',
                  components: 'country:il'
                }}
              />
            </View>
              <TouchableHighlight style={styles.button_ready} onPress={() => this.setState({modalVisible:false})}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF'}}>{strings('ordering.ready')}</Text>
              </TouchableHighlight>         
          </View>
        </Modal>
        <Modal
          visible={this.state.showAlert}
          animationType={'fade'}
          onRequestClose={() => {}}
          transparent={true}
        >
          <View style={styles.alert_overlay}>
            <View style={styles.alert_block}>
              <Text style={styles.alert_text}>{strings('ordering.whait')}</Text>
              <Spinner isVisible={true} size={38} type='ThreeBounce' color='#D80000'/>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.wrong_alert}
          animationType={'fade'}
          onRequestClose={() => this.setState({wrong_alert: false})}
          transparent={true}
        >
          <View style={styles.alert_overlay}>
            <View style={styles.alert_wrong}>
              <Text style={styles.alert_text}>{strings('ordering.wrong')}</Text>
              <View style={{alignSelf: 'flex-end'}}>
                <TouchableHighlight onPress={() => this.setState({wrong_alert: false})}>
                  <View style={styles.button_ok}>
                    <Text style={styles.button_text}>Ok</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.pay_modal}
          animationType={'fade'}
          onRequestClose={() => this.setState({wrong_alert: false})}
          transparent={true}
        >
          <WebView
            source={{uri: this.state.url}}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button_ready: {
    width: 140, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#D80000', 
    borderRadius: 30, 
    marginBottom: 20, 
    marginRight: 15, 
    alignSelf: 'flex-end'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 41,
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
  alert_wrong: {
    width: 240,
    height: 120,
    backgroundColor: '#0C0C0C',
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 14,
    paddingRight: 19,
    paddingLeft: 19,
  },
  alert_block: {
    width: 200,
    height: 100,
    backgroundColor: '#0C0C0C',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login_block: {
    width: '100%',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: '#121212',
    height: 40,
  },
  button_panel: {
    flexDirection: 'row',
    marginTop: '5.4%',
    marginBottom: '5.4%',
  },
  button_text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button_ok: {
    borderColor: '#D80000',
    borderWidth: 1,
    borderRadius: 30,
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  red_text: {
    color: '#D80000',
    fontSize: 16,
    lineHeight: 22,
  },
  bold_text: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: '2.4%',
    marginBottom: '3.1%',
  },
  simple_text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input_box: {
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 13,
  },
  input_box_picker: {
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 13,
  },
  caret: {
    position: 'absolute',
    top: 20,
  },
  text_input:{
    fontSize: 16,
    color: '#ffffff',
  },
});

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchReset: () => dispatch(reset()),
    dispatchShowAlert: (text) => dispatch(showAlert(text)),
    dispatchShowBeerAlert: () => dispatch(showBeerAlert()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ordering)