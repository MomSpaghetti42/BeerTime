import React, { Component } from 'react';

import {Tabs, Scene } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { strings } from '../locales/i18n';
import { Car_SVG, Beer_SVG, Profile_SVG } from '../svg/SVG_Beer';

import Orders from './Orders';
import Catalog from './Catalog';
import Profile from './Profile';

class CustomTab extends Component {
  render(){
    return(
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
          catalog={this.state.catalog}
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
      </Tabs>
    )
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#0C0C0C',
    paddingLeft: 24,
    paddingRight: 24,
  },
});



export default CustomTab;