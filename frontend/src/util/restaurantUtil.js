import axios from 'axios';
import { useContext } from 'react';
import { socket, SocketContext } from '../context/socket';

function fetchRestaurantData() {
  return navigator.geolocation.getCurrentPosition(success);
}

function success(pos) {
  const options = {
    method: 'GET',
    url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
    params: {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      limit: '30',
      currency: 'USD',
      distance: '10',
      open_now: 'false',
      lunit: 'km',
      lang: 'en_US',
    },
    headers: {
      'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      'x-rapidapi-key': process.env.REACT_APP_DB_KEY,
    },
  };
  axios
    .request(options)
    .then(function ({ data }) {
      //emit to backend
      const resData = data.data.filter((data) => {
        return Object.values(data).length > 8;
      });
      socket.emit('MASTER_LIST', resData);
    })
    .catch(function (error) {
      console.error(error);
    });
}

export default fetchRestaurantData;
