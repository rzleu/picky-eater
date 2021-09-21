/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { SocketContext } from '../../context/socket';
import CardSwipe from '../../components/lobby';

import styles from './lobby.module.css';
import fetchRestaurantData from '../../util/restaurantUtil';

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
  const [setRoomCode, setSetRoomCode] = useState('');

  // * maybe this isn't user
  const { username, id } = useSelector((state) => state.session.user);

  const handleJoinRoom = useCallback(() => {
    socket.emit('JOIN_ROOM');
  }, []);

  const handleCreateRoom = useCallback(async () => {
    const data = await fetchRestaurantData();
    socket.emit('CREATE_RAND_ROOM', data);
  }, []);

  const handleRoomAccepted = useCallback((data) => {
    setShowCardSwipe(true);
  }, []);

  const handleRoomCode = useCallback((code) => {
    setRoomCode(code);
  });

  useEffect(() => {
    if (username && id) {
      socket.emit('USER_ONLINE', { username, id });
    }

    socket.on('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
    socket.on('ROOM_CODE', handleRoomCode);

    return () => {
      socket.off('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
      socket.off('ROOM_CODE');
    };
  }, [socket, username, id, handleRoomAccepted]);

  return (
    <div className={styles.container}>
      {!showCardSwipe ? (
        <>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit(handleJoinRoom)}>
              <h2>Have a Pin?</h2>
              <div>
                <input {...register('lobby')} />
                <p className="errorMsg">{errors.lobby?.message}</p>
                <input type="submit" value="Enter" />
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
        <CardSwipe />
      )}
    </div>
  );
}

export default Lobby;
