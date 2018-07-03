import { combineReducers } from 'redux'
import { reducer as network } from 'react-native-offline';
import { 
  LOGIN_USER, 
  SHOW_ALERT, 
  HIDE_ALERT, 
  SHOW_APP, 
  INCREASE, 
  DECREASE, 
  RESET, 
  SET_INDICATOR, 
  SHOW_BEER_ALERT, 
  HIDE_BEER_ALERT,
  NO_NETWORK,
  HE_LANGUAGE,
  SET_CATALOG
} from '../actions/actions';
import I18n from 'react-native-i18n';

const socket = new WebSocket('ws://beertime.acsima.com:1112');
const initState = { loaded: false, socket: socket, network: true };

function catalog(state = [], action) {
  switch (action.type) {
    case SET_CATALOG: 
      return action.catalog
    default:
      return state
  }
}

function app_state(state = initState, action) {
  switch (action.type) {
    case SHOW_APP: 
      return { loaded: action.status, socket: socket, network: true }
    case NO_NETWORK:
      return { loaded: true, socket: socket, network: false }
    default:
      return state
  }
}

function user(state = {login_status: false}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return action
    default:
      return state
  }
}

function custom_alert(state = {show: false, text: 'Текст алерта'}, action) {
  switch (action.type) {
    case SHOW_ALERT:
      return {show: true, text: action.text};
    case HIDE_ALERT:
      return {show: false, text: ''}; 
    default:
      return state
  }
}

function beertimeAlert(state = false, action){
   switch (action.type) {
    case SHOW_BEER_ALERT:
      return true;
    case HIDE_BEER_ALERT:
      return false
    default:
      return state
  } 
}

function indicator(state = 0, action) {
  switch (action.type) {
    case SET_INDICATOR :
      return action.amount;
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    case RESET:
      return 0; 
    default:
      return state
  }
}

function language(state = 'ru', action) {
  switch (action.type) {
    case HE_LANGUAGE :
      I18n.locale = action.lang;
      return action.lang;
    default:
      return state
  }
}

const todoApp = combineReducers({
  app_state,
  user,
  custom_alert,
  indicator,
  beertimeAlert,
  network, 
  language,
  catalog
})

export default todoApp