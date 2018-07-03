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
import { Beer_SVG, Drop_with_Beer, Track } from '../svg/SVG_Beer';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CardOfOrder from '../components/CardOfOrder'
import { connect } from 'react-redux';

class In_Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      longitude_cour: +this.props.ln,
      latitude_cour: +this.props.lt,
    };
  }
  componentWillMount(){
    this.getCordinateCour()
  }
  getCordinateCour = () => {
    this.props.app_state.socket.onmessage = (e) => {
      let cor = JSON.parse(e.data);
      if (cor.cmd == 'send_coordinates') {
        this.setState({
          longitude_cour: cor.data[0].lon,
          latitude_cour: cor.data[0].lat,
        })
      }
    };
  }
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
          <MapViewDirections
               origin={{
                 latitude: +this.props.lt,
                 longitude: +this.props.ln,
               }}
               destination={{
                 latitude: this.state.latitude_cour,
                 longitude: this.state.longitude_cour,
               }}
               apikey={'AIzaSyC7ITwRDVIlLWVxQSy-qyL4QkeovAdhEN4'}
               strokeWidth={3}
               strokeColor="#D80000"
               onReady={(result) => {
                 console.log(result.duration);
               }}
             />
          <MapView.Marker
            coordinate={{
              latitude: this.state.latitude_cour,
              longitude: this.state.longitude_cour,
            }}
            image={require('../img/marker.png')}
          />
        </MapView>
        <CardOfOrder 
          active={true} 
          status={this.props.status} 
          money={this.props.price} 
          number={this.props.number} 
          date={this.props.created_at}
          language={this.props.language}
        />
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
  image: {
    position: 'absolute',
  },
  order_block: {
    width: 341,
    borderRadius: 10,
    height: 95,
    backgroundColor: "#242424",
    marginBottom: 12,
    paddingRight: 21,
    paddingLeft: 22,
    paddingTop: 12,
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
  deliver_status:{
    flexDirection: 'row',
    justifyContent: 'flex-start',  
    alignItems: 'center',
  },
  deliver_icon: {
    marginRight: 8,
  },
  text_b: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  text_1: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',   
  },
  text_2: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  marker: {
    position: 'relative',
    bottom: '35%',
  },
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps) (In_Map);