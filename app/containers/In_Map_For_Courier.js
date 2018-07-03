import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Slider,
  Image,
  TouchableHighlight,
} from 'react-native';
import { Beer_SVG, Drop_with_Beer } from '../svg/SVG_Beer';
import MapView from 'react-native-maps';
import CardOfOrderForCourier from '../components/CardOfOrderForCourier';

class In_Map_For_Courier extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{width: '100%', height: '100%', position: 'absolute',}}
          initialRegion={{
            latitude: +this.props.lt,
            longitude: +this.props.ln,
            latitudeDelta: 0.0030,
            longitudeDelta: 0.0030,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: +this.props.lt,
              longitude: +this.props.ln,
            }}
            image={require('../img/marker.png')}
          />
        </MapView>
        <View style={styles.card}>
          <CardOfOrderForCourier
            active={this.props.active}
            address={this.props.address}
            number={this.props.number}
            money={this.props.price}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  card: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default In_Map_For_Courier;