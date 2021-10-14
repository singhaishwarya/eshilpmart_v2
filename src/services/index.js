export const userData = localStorage.getItem('persist:root') ?
  JSON.parse(JSON.parse(localStorage.getItem('persist:root')).userData) : '';

export const baseUrl = 'https://admin.digitalindiacorporation.in/api/';
export const config = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (userData ? userData?.token : ''),
  }
};