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
  const [fetchedData, setFetchedData] = useState(true);
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);

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

  function success(pos) {
    setFetchedData(false);
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
        lunit: 'mi',
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
        setFetchedData(true);
        // console.log({ data });
        const resData = data.data
          .filter((data) => {
            return Object.values(data).length > 8;
          })
          .map(
            ({
              name,
              photo,
              phone,
              price_level,
              website,
              num_reviews,
              address,
              latitude,
              longitude,
              location_id,
              distance_string,
            }) => ({
              name,
              photo,
              phone,
              price_level,
              website,
              num_reviews,
              address,
              latitude,
              longitude,
              location_id,
              distance_string,
            }),
          );

        setMasterList(resData);
        return resData;
        // socket.emit('MASTER_LIST', resData);
      })
      .catch(function (error) {
        console.log('Blame Anthony');
        console.error(error);
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
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
  console.log(`id: ${socket.id}`);
  // new PincodeInput('.pincodeInputContainer', {
  //   onInput: (value) => {
  //     console.log(value);
  //   },
  // });
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
                <p className="errorMsg">{errors.lobby?.message}</p>
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
                  {!fetchedData
                    ? !fetchedData && (
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
                      )
                    : 'Create'}
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
