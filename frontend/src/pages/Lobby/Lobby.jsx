/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { SocketContext } from '../../context/socket';
import CardSwipe from '../../components/lobby';
import WAVES from 'vanta/dist/vanta.waves.min';
import styles from './lobby.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import {
  User,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Trash2,
} from 'react-feather';
import { CSSTransition } from 'react-transition-group';
import useOutsideClick from '../../hooks/useOutsideClick';
import { logout, fetchUser } from '../../actions/sessionActions';
import {
  deleteRestaurant,
  fetchRestaurantExperience,
} from '../../actions/restaurantActions';
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
  const [showDropDown, setShowDropDown] = useState(null);
  const [showMatches, setShowMatches] = useState(null);
  // const [showCardSwipe, setShowCardSwipe] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [masterList, setMasterList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  const [invalidRoomError, setinvalidRoomError] = useState(null);
  const listRef = useRef([]);
  const clickRef = useRef();
  const savedListRef = useRef();
  const dispatch = useDispatch();
  const savedRest = useSelector((state) => state.session.user.saved);
  const userId = useSelector((state) => state.session.user.id);
  const user = useSelector((state) => state.session.user);
  const [experience, setExperience] = useState('');
  const [saved, setSaved] = useState([]);
  useOutsideClick(clickRef, () => setShowDropDown(false));
  useOutsideClick(savedListRef, () => setShowMatches(false));
  console.log({ savedRest });
  // * VANTA
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          zoom: 0.65,
          mouseControls: false,
          touchControls: true,
          gyroControls: true,
          minHeight: 500.0,
          minWidth: 400.0,
          color: 0x121220,
          // color: 0x21213b,
          scale: 1,
          shininess: 70.0,
          waveHeight: 20.0,
          waveSpeed: 0.2,
        }),
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // // * fetch user
  // useEffect(() => {
  //   axios
  //     .get('/api/users', {
  //       params: {
  //         userId,
  //       },
  //     })
  //     .then((res) => {
  //       setSaved(res.data.saved);
  //     });
  // }, [experience]);

  // SOCKET.IO
  const handleJoinRoom = useCallback(({ lobby }) => {
    socket.emit('JOIN_ROOM', lobby);
    socket.on('INVALID_PIN', (message) => {
      setinvalidRoomError(message);
      setTimeout(() => {
        setinvalidRoomError(null);
      }, 3000);
    });
  }, []);
  const handleCreateRoom = useCallback((e) => {
    e.preventDefault();
    // if (listRef.current.length) {
    socket.emit('CREATE_RAND_ROOM', convertList());
    // }
  }, []);
  const handleRoomAccepted = useCallback((data) => {
    // setShowCardSwipe(true);
    setRoomCode(data);
  }, []);
  const handleRoomCode = useCallback((code) => {
    setRoomCode(code);
  }, []);
  const handleMasterList = useCallback((data) => {
    if (data && data.length) {
      setMasterList(data);
    }
  }, []);

  // Google API Call
  const clientSideGoogle = async (pos) => {
    const location = new window.google.maps.LatLng(
      pos.coords.latitude,
      pos.coords.longitude,
    );

    const request = {
      location: location,
      radius: '8000',
      type: ['food'],
      keyword: ['restaurant'],
    };

    const service = new window.google.maps.places.PlacesService(
      document.getElementById('google-attr'),
    );

    service.nearbySearch(request, callback);

    // nearbySearch callback
    function callback(results, status) {
      setFetchingData(true);
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK
      ) {
        for (let i = 0; i < results.length; i++) {
          const request = {
            placeId: results[i].place_id,
            fields: [
              'name',
              'vicinity',
              'formatted_phone_number',
              'photos',
              'rating',
              'website',
              'place_id',
            ],
          };
          const innerCallback = async (place, status) => {
            if (
              status ===
              window.google.maps.places.PlacesServiceStatus.OK
            ) {
              listRef.current = [...listRef.current, place];
            }
          };
          service.getDetails(request, innerCallback);
        }
        setFetchingData(false);
      }
    }
  };

  // utlity for converting functions to urls
  const convertList = () => {
    const temp = listRef.current.map(({ photos, ...rest }) => ({
      ...rest,
      photos: photos.map((photo) => photo.getUrl({ width: 500 })),
    }));
    return temp;
  };

  // Geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(clientSideGoogle, null, {
      enableHighAccuracy: true,
    });
    console.log({ userId });
    if (userId) {
      dispatch(fetchUser(userId));
    }
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
      {/* DROPDOWN */}
      <div
        ref={clickRef}
        className={styles.dropDown}
        type="button"
        onClick={() => setShowDropDown((old) => !old)}
      >
        <User color="white" z-index="2" />
        <CSSTransition
          in={showDropDown}
          timeout={1000}
          classNames="navbar-ani"
          unmountOnExit
        >
          <ul className="nav--dropdown">
            <li>{user.username}</li>
            <li
              onClick={() => {
                dispatch(logout());
              }}
            >
              Logout
            </li>
            <li onClick={() => setShowMatches((old) => !old)}>
              Matches
            </li>
          </ul>
        </CSSTransition>
      </div>
      {/* show matches */}
      {showMatches && (
        <div className={styles.showMatches} ref={savedListRef}>
          {(!savedRest || !savedRest.length) && (
            <div> No Matches</div>
          )}
          {savedRest.map((match) => {
            // console.log(match);
            return (
              <div
                className={styles.matchContainer}
                key={match.place_id}
              >
                <li>{match.name}</li>
                <div className={styles.reactions}>
                  <ThumbsUp
                    onClick={() =>
                      dispatch(
                        fetchRestaurantExperience(
                          match.place_id,
                          userId,
                          'good',
                        ),
                      )
                    }
                  />
                  <ThumbsDown
                    onClick={() =>
                      dispatch(
                        fetchRestaurantExperience(
                          match.place_id,
                          userId,
                          'bad',
                        ),
                      )
                    }
                  />
                  <Meh
                    onClick={() =>
                      dispatch(
                        fetchRestaurantExperience(
                          match.place_id,
                          userId,
                          'neutral',
                        ),
                      )
                    }
                  />
                  <Trash2
                    onClick={() => {
                      dispatch(
                        deleteRestaurant(match.place_id, userId),
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MAIN LOBBY */}
      {!roomCode ? (
        <h2 style={{ opacity: '0' }}>ROOM CODE: {roomCode}</h2>
      ) : (
        <h2>ROOM CODE: {roomCode}</h2>
      )}
      <Link className={styles.aboutLink} to="/about">
        <FontAwesomeIcon
          className={styles.keyBoard}
          icon={faKeyboard}
        />
        <p>About the Creators</p>
      </Link>
      {!roomCode ? (
        <>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit(handleJoinRoom)}>
              <h2 className={styles.havePin}>Have a Pin?</h2>
              <div className={styles.inputContainer}>
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
                  disabled={fetchingData}
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
        <CardSwipe masterList={convertList()} />
      )}
    </div>
  );
}

export default Lobby;
