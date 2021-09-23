/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import * as yup from 'yup';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { SocketContext } from '../../context/socket';
import CardSwipe from '../../components/lobby';

import styles from './lobby.module.css';

const schema = yup.object().shape({
  lobby: yup.string().required(),
});

function Lobby() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const socket = useContext(SocketContext);
  const [showCardSwipe, setShowCardSwipe] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [masterList, setMasterList] = useState([]);
  const [fetchedData, setFetchedData] = useState(true);

  // * maybe this isn't user
  const { username, id } = useSelector((state) => state.session.user);

  const handleJoinRoom = useCallback(({ lobby }) => {
    socket.emit('JOIN_ROOM', lobby);
  }, []);

  const handleCreateRoom = useCallback(() => {
    if (masterList.length) {
      socket.emit('CREATE_RAND_ROOM', masterList);
    }
  }, [masterList]);

  const handleRoomAccepted = useCallback((data) => {
    setShowCardSwipe(true);
    setRoomCode(data);
  }, []);

  const handleRoomCode = useCallback((code) => {
    setRoomCode(code);
  });

  const handleMasterList = useCallback((data) => {
    if (data && data.length) {
      setMasterList(data);
    }
  });

  async function success(pos) {
    setFetchedData(false);

    const placeIdOptions = {
      method: 'GET',
      url: `https://gentle-thicket-64456.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pos.coords.latitude}%2C${pos.coords.longitude}&type=restaurant&type=food&radius=16000&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
      headers: {},
    };

    try {
      const placeIds = await axios(placeIdOptions)
        .then((data) => {
          return data.data.results.map(({ place_id }) => {
            return place_id;
          });
        })
        .catch((error) => {
          console.log(error);
        });

      const restaurants = placeIds.map(async (placeId) => {
        const placeDetailOptions = {
          method: 'GET',
          url: `https://gentle-thicket-64456.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
          headers: {},
        };

        const placeDetails = await axios(placeDetailOptions)
          .then((data) => {
            return data.data.result;
          })
          .catch((error) => {
            console.log(error);
          });

        return placeDetails;
      });

      const resDetails = (await Promise.all(restaurants)).map(
        (data) => {
          return {
            name: data.name,
            address: data.vicinity,
            phone: data.formatted_phone_number,
            location: data.geometry.location,
            photoRefs: data.photos
              .map((photo) => {
                return photo.photo_reference;
              })
              .sort(() => 0.5 - Math.random())
              .slice(0, 3),
            rating: data.rating,
            website: data.website,
          };
        },
      );

      setMasterList(resDetails);
    } catch (error) {
      console.error(error);
    }

    // resDetails.map(async (photoRef) => {
    //   const photoOptions = {
    //     method: 'GET',
    //     url: `https://gentle-thicket-64456.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxwidth=500&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
    //     headers: {},
    //   };

    //   return await axios(photoOptions).then(() => {

    //   });
    // })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, null, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (masterList.length) {
      socket.emit('MASTER_LIST', masterList);
    }
  }, [masterList]);

  useEffect(() => {
    if (username && id) {
      socket.emit('USER_ONLINE', { username, id });
    }

    socket.on('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
    socket.on('ROOM_CODE', handleRoomCode);
    socket.on('MASTER_LIST', handleMasterList);

    // return () => {
    //   socket.off('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
    //   socket.off('ROOM_CODE');
    // };
  }, [socket, username, id, handleRoomAccepted]);
  console.log(masterList);
  return (
    <div className={styles.container}>
      <h2>ROOM CODE IS {roomCode}</h2>
      {!fetchedData && <div>...loading</div>}
      {!roomCode ? (
        <>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit(handleJoinRoom)}>
              <h2>Have a Pin?</h2>
              <div>
                <input {...register('lobby')} />
                <p className="errorMsg">{errors.lobby?.message}</p>
                <input
                  className={styles.lobbyEnter}
                  type="submit"
                  value="Enter"
                />
              </div>
            </form>
            <div>
              <h3>Create a room?</h3>
              <button onClick={handleCreateRoom}>
                Generate Random Room!
              </button>
            </div>
          </div>
        </>
      ) : (
        <CardSwipe masterList={masterList} />
      )}
    </div>
  );
}

export default Lobby;
