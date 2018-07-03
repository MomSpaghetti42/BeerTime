import React from 'react';
import {
  StatusBar,
  View
} from 'react-native';

import { createStore } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import { Provider, connect } from 'react-redux';
import { withNetworkConnectivity } from 'react-native-offline';

import todoApp from './reducers/reducers';
import AppContainer from './containers/AppContainer';

const store = createStore(todoApp, devToolsEnhancer());

AppContainerWithOfflne = withNetworkConnectivity({
  withRedux: true,
  pingServerUrl: 'http://beertime.acsima.com',
})(AppContainer);

const App = () => (
	<View style={{flex: 1, height: '100%', width: '100%',}}>
		<StatusBar
      backgroundColor="#0C0C0C"
      barStyle="light-content"
    />
	  <Provider store={store}>
	    <AppContainerWithOfflne/>
	  </Provider>
  </View>
);

export default App;