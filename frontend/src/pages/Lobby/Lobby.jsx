/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import * as yup from 'yup';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { SocketContext } from '../../context/socket';
import CardSwipe from '../../components/lobby';
import WAVES from 'vanta/dist/vanta.waves.min';
import PincodeInput from 'pincode-input';
import 'pincode-input/dist/pincode-input.min.css';
import styles from './lobby.module.css';

// VANTA.WAVES('.lobbyContainer');

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
  const [fetchingData, setFetchingData] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  const [invalidRoomError, setinvalidRoomError] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          zoom: 0.65,
          mouseControls: false,
          touchControls: true,
          gyroControls: false,
          minHeight: 500.0,
          minWidth: 500.0,
          color: 0x312d2d,
          scale: 0.5,
          shininess: 16.0,
          waveHeight: 11.0,
          waveSpeed: 0.2,
        }),
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // * maybe this isn't user
  const { username, id } = useSelector((state) => state.session.user);

  const handleJoinRoom = useCallback(({ lobby }) => {
    console.log(lobby);
    socket.emit('JOIN_ROOM', lobby);
    socket.on('INVALID_PIN', (message) => {
      setinvalidRoomError(message);
      setTimeout(() => {
        setinvalidRoomError(null);
      }, 3000);
    });
  }, []);

  const handleCreateRoom = useCallback(
    (e) => {
      e.preventDefault();
      if (masterList.length) {
        socket.emit('CREATE_RAND_ROOM', masterList);
      }
    },
    [masterList],
  );

  const handleRoomAccepted = useCallback((data) => {
    setShowCardSwipe(true);
    setRoomCode(data);
  }, []);

  const handleRoomCode = useCallback((code) => {
    setRoomCode(code);
  }, []);

  const handleMasterList = useCallback((data) => {
    console.log({ data });
    if (data && data.length) {
      setMasterList(data);
    }
  }, []);

  async function success(pos) {
    setFetchingData(true);

    const placeIdOptions = {
      method: 'GET',
      url: `https://gentle-thicket-64456.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pos.coords.latitude}%2C${pos.coords.longitude}&keyword=restaurant&type=food&radius=8000&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
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
      setFetchingData(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, null, {
      enableHighAccuracy: true,
    });

    socket.on('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
    socket.on('ROOM_CODE', handleRoomCode);
    socket.on('MASTER_LIST', handleMasterList);

    return () => {
      socket.off('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
      socket.off('ROOM_CODE', handleRoomCode);
      socket.off('MASTER_LIST', handleMasterList);
    };
  }, []);

  return (
    <div className={`${styles.container}`} ref={vantaRef}>
      {/* {!roomCode ? null : <h2>ROOM CODE IS {roomCode}</h2>} */}
      {/* {document.querySelector('.card') ? (
        <h2>ROOM CODE IS {roomCode}</h2>
      ) : null} */}
      <h2>ROOM CODE: {roomCode}</h2>

      {!roomCode ? (
        <>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit(handleJoinRoom)}>
              <h2 className={styles.havePin}>Have a Pin?</h2>
              <div className={styles.inputContainer}>
                {/* <div
                  class={styles.pincodeInputContainer}
                  {...register('lobby')}
                ></div> */}
                <input
                  placeholder={'PIN'}
                  className={styles.pinInput}
                  {...register('lobby')}
                />
                {errors.lobby?.message ? (
                  <p className="errorMsg">{errors.lobby?.message}</p>
                ) : invalidRoomError ? (
                  <p className="errorMsg">{invalidRoomError}</p>
                ) : null}
                <input
                  className={styles.lobbyEnter}
                  type="submit"
                  value="Enter"
                />
              </div>
              <div>
                <h3 className={styles.createRoom}>Create a room?</h3>
                <button
                  className={styles.generateButton}
                  onClick={handleCreateRoom}
                >
                  {fetchingData ? (
                    <svg
                      className={styles.loader}
                      width="50px"
                      height="50px"
                      viewBox="0 0 66 66"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className={styles.path}
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        cx="33"
                        cy="33"
                        r="30"
                      ></circle>
                    </svg>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <CardSwipe masterList={masterList} />
      )}
    </div>
  );
}

export default Lobby;
