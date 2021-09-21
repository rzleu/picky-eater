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

  // * maybe this isn't user
  const { username, id } = useSelector((state) => state.session.user);

  const handleJoinRoom = useCallback(() => {
    socket.emit('JOIN_ROOM');
  }, []);

  const handleCreateRoom = useCallback(() => {
    socket.emit('CREATE_RAND_ROOM');
  }, []);

  const handleRoomAccepted = useCallback(() => {
    setShowCardSwipe(true);
  }, []);

  useEffect(() => {
    if (username && id) {
      socket.emit('USER_ONLINE', { username, id });
    }

    socket.on('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);

    return () => {
      socket.off('JOIN_REQUEST_ACCEPTED', handleRoomAccepted);
    };
  }, [socket, username, id, handleRoomAccepted]);

  return (
    <div>
      {!showCardSwipe ? (
        <div>
          <h2>Have a Pin?</h2>
          <form onSubmit={handleSubmit(handleJoinRoom)}>
            <input {...register('lobby')} />
            <p>{errors.lobby?.message}</p>
          </form>
          <h3>Create a room?</h3>
          <button onClick={handleCreateRoom}>
            Generate Random Room!
          </button>
        </div>
      ) : (
        <CardSwipe />
      )}
    </div>
  );
}

export default Lobby;
