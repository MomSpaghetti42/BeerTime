import React, { Component } from 'react';
import {Actions} from 'react-native-router-flux';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  FlatList,
  AsyncStorage,
} from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { Arrow_SVG, Cross_SVG } from '../svg/SVG_Beer';
import { connect } from 'react-redux';

class Item extends Component {
  render() {
    return(
      <TouchableHighlight onPress={() => Actions.product({
          product_name_ru: this.props.name_ru,
          product_name_he: this.props.name_he,
          product_descrip_ru: this.props.description_ru,
          product_descrip_he: this.props.description_he,
          product_price: this.props.price,
          product_id: this.props.id,
          product_img: this.props.img,
          title: this.props.name_ru,
          country: this.props.country,
        })}>
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
            <View style={styles.price}>
              <View style={styles.liters_block}>
              </View>
              <View style={this.props.language == 'he' ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}}>
                <Text style={styles.text_b}>{this.props.price}</Text>
                <Text style={styles.text_b}>₪</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      )
  }
}

class Catalog extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  };

  clearValue = () => {
    this.setState({
      searchTerm: '',
    });
  }
  componentWillMount() {
    console.log(this.props.catalog);
    if (this.props.catalog != null) {
      this.setState({filteredUser: this.props.catalog.filter(createFilter(this.state.searchTerm, 'name_ru'))})
    }
  }
  render(){
    console.log(this.props.catalog);
    console.log(this.state.filteredUser);
    if ( this.props.catalog != null ) 
    return (
      <View style={styles.container}>
        { this.props.hideNavBar == true ? 
          <View style={{width: '100%', height: 55, backgroundColor: '#121212', justifyContent: 'center', paddingLeft: 10, paddingRight: 10,}}>
            <View style={{width: '100%', height: 38, backgroundColor: 'rgba(255, 255, 255, 0.05)',paddingLeft: 16, paddingRight: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
              <TouchableHighlight onPress={() => {Actions.refresh({ hideNavBar: false }), this.setState({searchTerm: '',})}} ><View><Arrow_SVG/></View></TouchableHighlight>
              <SearchInput 
                selectionColor={'#ffffff'}
                placeholder="Поиск по каталогу…"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoFocus={true} 
                value={this.state.searchTerm}
                style={{color: '#FFFFFF',marginLeft: 16, marginRight: 16,}}
                inputViewStyles={{flex: 1, width:'100%',}}
                onChangeText={(term) => { this.searchUpdated(term) }} 
              />
              <TouchableHighlight onPress={this.clearValue}><View><Cross_SVG/></View></TouchableHighlight>            
            </View>
          </View>
         : null
        }
        <ScrollView style={styles.all_orders}>
          {this.state.filteredUser.map((item, i, arr) => {
            return (
              <Item 
                key={i}
                id={item.id}
                name_ru={item.name_ru} 
                name_he={item.name_he} 
                price={item.price} 
                liters={item.liters} 
                img={item.img_url} 
                description_ru={item.description_ru}
                description_he={item.description_he}
                country={item.country}
                language={this.props.language}
              />
            )
          })}
        </ScrollView>
      </View>
    )
    else {
      return(
        <View style={styles.container}>
        </View>
      )
    }
  }
  componentDidMount() {
    console.log(this.props.catalog);
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
});

const mapStateToProps = state => (state);

export default connect(mapStateToProps) (Catalog);
