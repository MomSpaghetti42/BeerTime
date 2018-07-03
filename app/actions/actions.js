export const SHOW_APP = 'SHOW_APP'
export const LOGIN_USER = 'LOGIN_USER'
export const SHOW_ALERT = 'SHOW_ALERT'
export const HIDE_ALERT = 'HIDE_ALERT'
export const INCREASE = 'INCREASE'
export const DECREASE = 'DECREASE'
export const RESET = 'RESET'
export const SET_INDICATOR = 'SET_INDICATOR'
export const SHOW_BEER_ALERT = 'SHOW_BEER_ALERT'
export const HIDE_BEER_ALERT = 'HIDE_BEER_ALERT'
export const NO_NETWORK = 'NO_NETWORK'
export const HE_LANGUAGE = 'HE_LANGUAGE'
export const SET_CATALOG = 'SET_CATALOG'

export function showApp(status) {
  return {
    type: SHOW_APP,
    status: status,
  };
}

export function noNetwork() {
  return {
    type: NO_NETWORK,
  };
}

export function loginUser(login_status, user) {
  return {
    type: LOGIN_USER,
    login_status: login_status,
    user: user,
  };
}

export function showAlert(text) {
  return {
    type: SHOW_ALERT,
    text: text,
  };
}

export function hideAlert() {
  return {
    type: HIDE_ALERT,
    text: 'Нет',
  };
}

export function showBeerAlert() {
  return {
    type: SHOW_BEER_ALERT,
  };
}

export function hideBeerAlert() {
  return {
    type: HIDE_BEER_ALERT,
  };
}

export function increase() {
  return {
    type: INCREASE,
  };
}

export function decrease() {
  return {
    type: DECREASE,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function setIndicator(amount) {
  return {
    type: SET_INDICATOR,
    amount: amount
  };
}

export function heLanguage(lang){
  return {
    type: HE_LANGUAGE,
    lang: lang,
  };
}

export function set_catalog(catalog) {
  console.log('set_catalog')
  return {
    type: SET_CATALOG,
    catalog: catalog,
  };
}