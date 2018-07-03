import {
  AsyncStorage
} from 'react-native';

const url = 'http://beertime.acsima.com/api'
const headers = {'Accept': 'application/json','Content-Type': 'application/json',}

export function RequestCatalog(updated){
  return fetch( url+'/beers', {
    method: 'POST',
    headers: headers,
    credentials: 'same-origin',
    body: JSON.stringify({
      updated: updated == null ? 49 : updated,
    })
  })
  .then(response => response.json())
  .then(responseJson => responseJson)
  .catch(error => 'error');
}

export function FetchLogin(user){
  return fetch( url+'/user/login', {
    method: 'POST',
    headers: headers,
    credentials: 'same-origin',
    body: JSON.stringify({
      google_id: user.id,
      email: user.email,
      password: user.password,
      name: user.givenName,
      second_name: user.familyName,
      fb_id: user.fb_id,
    })
  })
  .then(response => response.json())
  .then(responseJson => responseJson)
  .catch(error => 'error');
}