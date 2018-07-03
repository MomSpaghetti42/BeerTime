import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  StatusBar,
  Image,
  AsyncStorage
} from 'react-native';

import {Scene, Router, Actions, Tabs} from 'react-native-router-flux';
import { connect } from 'react-redux';
import Spinner from 'react-native-spinkit';
import * as Keychain from 'react-native-keychain';
import { GoogleSignin } from 'react-native-google-signin';
import I18n from 'react-native-i18n';
import { strings } from '../locales/i18n';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

import { hideAlert, loginUser, showApp, setIndicator, hideBeerAlert, noNetwork, heLanguage, set_catalog } from '../actions/actions';

import { Car_SVG, Beer_SVG, Profile_SVG, It_is_SVG } from '../svg/SVG_Beer';

import OutButton from '../components/OutButton';
import BasketButton from '../components/BasketButton';
import LanguageModal from '../components/LanguageModal';
import Lens from '../components/Lens';
import Product from './Product';
import Basket from './Basket';
import Main from './Main';
import Orders from './Orders';
import Catalog from './Catalog';
import Profile from './Profile';
import Order from './Order';
import In_Map from './In_Map';
import Ordering from './Ordering';
import Discount from './Discount';
import CardOfClub from './CardOfClub';
import Name from './Name';
import Registration from './Registration';
import Courier from './Courier';
import TaskForCourier from './TaskForCourier';
import In_Map_For_Courier from './In_Map_For_Courier';
import Edit from './Edit';

import { RequestCatalog, FetchLogin } from '../query/query';

class AppContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      catalog: [],
      courier: false,
      LanguageModal: false,
    };
  }
  render(){
    if (this.props.app_state.loaded == true)
    return(
      <View style={styles.container}>
        <Router sceneStyle={styles.sceneStyle}>
          <Scene
            key="root"
            navigationBarStyle={styles.navBarStyle.bar}
            titleStyle={styles.navBarStyle.title}
            renderRightButton={<BasketButton/>}
            backButtonImage={this.props.language == 'he' ? require('../img/back_revers.png') : require('../img/back.png')}
          >
            <Scene key="main" hideNavBar component={Main} initial={!this.state.courier}/>
            {this.props.language == 'ru' ? 
              <Tabs 
                key="tabbar" 
                tabBarStyle={styles.tabBarStyle} 
                tabBarPosition='bottom' 
                inactiveTintColor="rgba(255, 255, 255, 0.4)"
                activeTintColor="#FFFFFF"
                back={true}
              >
                <Scene 
                  key="orders" 
                  title={strings('menu.orders')}
                  tabBarLabel={strings('menu.orders')}
                  component={Orders} 
                  icon={({ focused }) => <Car_SVG color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"} width={20} height={18} />} 
                />
                <Scene 
                  key="catalog" 
                  title={strings('menu.catalog')}
                  tabBarLabel={strings('menu.catalog')}
                  component={Catalog} 
                  renderRightButton={
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 73}}>
                      <Lens/>
                      <BasketButton/>
                    </View>
                  }
                  icon={({ focused }) => <Beer_SVG color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"} width={18} height={20} />} 
                />
                <Scene 
                  key="profile" 
                  title={strings('menu.profile')}
                  tabBarLabel={strings('menu.profile')}
                  component={Profile} 
                  icon={({ focused }) => <Profile_SVG  color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"} width={21} height={21} />} 
                />
              </Tabs> : 
              <Tabs 
                key="tabbar" 
                tabBarStyle={styles.tabBarStyle} 
                tabBarPosition='bottom' 
                inactiveTintColor="rgba(255, 255, 255, 0.4)"
                activeTintColor="#FFFFFF"
                back={true}
              >
                <Scene 
                  key="profile" 
                  title={strings('menu.profile')}
                  tabBarLabel={strings('menu.profile')}
                  component={Profile} 
                  icon={({ focused }) => <Profile_SVG  color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"} width={21} height={21} />} 
                />
                <Scene 
                  key="catalog" 
                  title={strings('menu.catalog')}
                  tabBarLabel={strings('menu.catalog')}
                  component={Catalog} 
                  renderRightButton={
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 73}}>
                      <Lens/>
                      <BasketButton/>
                    </View>
                  }
                  icon={({ focused }) => <Beer_SVG color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"} width={18} height={20} />} 
                />
                <Scene 
                  key="orders" 
                  title={strings('menu.orders')}
                  tabBarLabel={strings('menu.orders')}
                  component={Orders} 
                  icon={({ focused }) => <Car_SVG color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"} width={20} height={18} />} 
                />
              </Tabs>
            }
            <Scene key="order" title={strings('menu.order')}  component={Order}/>
            <Scene key="product" component={Product} />
            <Scene key="in_map" title={strings('menu.map')} component={In_Map}  />
            <Scene key="ordering" title={strings('menu.ordering')} component={Ordering}  />
            <Scene key="discount" title={strings('menu.discount')} component={Discount}  />
            <Scene key="card_of_club" title={strings('menu.card_of_club')} component={CardOfClub}  />
            <Scene key="name" title={strings('menu.name')} component={Name} renderRightButton={null} />
            <Scene key="registration" title={strings('menu.registration')} component={Registration} renderRightButton={null} />
            <Scene key="basket" title={strings('menu.basket')} component={Basket} />
            <Scene key="edit" title={strings('menu.edit')} component={Edit} />
            <Scene 
              key="courier" 
              component={Courier} 
              initial={this.state.courier} 
              renderRightButton={ <OutButton/> }
              backButtonImage={null}
            />
            <Scene 
              key="task_for_courier" 
              title="Заказ" 
              component={TaskForCourier} 
              renderRightButton={ <OutButton/> }
            />
            <Scene 
              key="in_map_for_courier" 
              title="Карта" 
              component={In_Map_For_Courier} 
              renderRightButton={ <OutButton/> }
            />
          </Scene>
        </Router>
        <Modal
          visible={this.props.custom_alert.show}
          animationType={'fade'}
          onRequestClose={() => this.props.dispatchHideAlert()}
          transparent={true}
        >
          <View style={styles.alert_overlay}>
            <View style={styles.alert_wrong}>
              <Text style={styles.alert_text}>{this.props.custom_alert.text}</Text>
              <View style={{alignSelf: 'flex-end'}}>
                <TouchableHighlight onPress={() => this.props.dispatchHideAlert()}>
                  <View style={styles.button_ok}>
                    <Text style={styles.button_text}>Ok</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.beertimeAlert}
          onRequestClose={() => this.porps.dispatchHideBeerAlert()}>
          <View style={{flex: 1, backgroundColor:'rgba(0, 0, 0, 0.6)', justifyContent: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <View style={{marginBottom: 10}}>
                <It_is_SVG/>
              </View>
              <Image source={require('../img/main_logo.png')} style={{width: '100%',height: '70%', }}/>
            </View>
          </View>
        </Modal>
      </View>
    )
    else
      return(
        <View style={styles.container_2}>
          <StatusBar
            backgroundColor="#0C0C0C"
            barStyle="light-content"
            hidden={true}
          />
          <Image source={require('../img/main_logo.png')} style={styles.logo}/>
          <Spinner style={{position: 'absolute', bottom: 0,}} isVisible={true} size={58} type='ThreeBounce' color='#D80000'/>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.LanguageModal}
            onRequestClose={() => this.setState({LanguageModal: false})}>
            <LanguageModal/>
          </Modal>
        </View>
      )
  }

  componentDidMount() {
    this.setLanguage();
    this.MidSetIndicator();
    this.getCatalog();
  }

  setLanguage = async () => {
    let value = await AsyncStorage.getItem('Language');
    let language = JSON.parse(value)
    if (language == null) {
      this.setState({LanguageModal: true})
    } 
    else { 
      this.props.dispatchHeLanguage(language);
      this.setUser();
    }
  }

  getCatalog = async () => {
    let updated = await AsyncStorage.getItem('updated');
    let response = await RequestCatalog(updated);
    if (response == 'use_local' || response == 'error') {
      let catalogJson = await AsyncStorage.getItem('catalog');
      let catalog = JSON.parse(catalogJson);
      this.props.dispatchSetCatalog(catalog);
    }
    else {
      let catalogJson = JSON.stringify(response.beers);
      let updatedJson = JSON.stringify(response.updated);
      AsyncStorage.setItem('catalog', catalogJson );
      AsyncStorage.setItem('updated', updatedJson);
      this.props.dispatchSetCatalog(response.beers);
    }
  }

  setUser = async () => {
    let logined_user = await AsyncStorage.getItem('logined_user');
    let userJson = JSON.parse(logined_user);
    this.props.dispatchLoginUser(userJson == null ? false : true, userJson);
    this.props.dispatchShowApp(true);
  }

  MidSetIndicator = async () => {
    let response = await AsyncStorage.getItem('purches');
    let purches = JSON.parse(response);
    if (purches != null) this.props.dispatchSetIndicator(purches.length);
  }

}

const styles = {
  navBarStyle: {
    bar: {
      backgroundColor: '#121212',
      paddingRight: 20, 
      paddingLeft: 20, 
      elevation: 0,
    },
    title: {
      color: '#FFFFFF',
      marginLeft: 0,
    }
  },
  tabBarStyle: {
    backgroundColor: '#0C0C0C',
    paddingLeft: 24,
    paddingRight: 24,
  },
  sceneStyle: {
    backgroundColor: "#121212",
  },
  container: {
    flex: 1, 
    height: '100%', 
    width: '100%',
  },
  container_2: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#0C0C0C'
  },
  logo: {
    width: '100%',
    height: '50%', 
    position: 'relative', 
    bottom: 40,
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
    width: '90%',
    backgroundColor: '#0C0C0C',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 14,
    paddingRight: 19,
    paddingLeft: 19,
  },
};

const mapStateToProps = state => (state);

function mapDispatchToProps (dispatch) {
  return {
    dispatchHideAlert: () => dispatch(hideAlert()),
    dispatchShowApp: (status) => dispatch(showApp(status)),
    dispatchLoginUser: (login_status, user) => dispatch(loginUser(login_status, user)),
    dispatchSetIndicator: (amount) => dispatch(setIndicator(amount)),
    dispatchHideBeerAlert: () => dispatch(hideBeerAlert()),
    dispatchHeLanguage: (lang) => dispatch(heLanguage(lang)),
    dispatchSetCatalog: (catalog) => dispatch(set_catalog(catalog)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (AppContainer);