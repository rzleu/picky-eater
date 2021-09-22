import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { SocketContext } from '../../context/socket';
import style from './cardswipe.module.css';

// @ts-ignore

function CardSwipe({ masterList = [] }) {
  const [approvedList, setApprovedList] = useState([]);
  const [masterListCopy, setMasterListCopy] = useState(masterList);
  const [match, setMatch] = useState(null);
  const socket = useContext(SocketContext);

  const handleMasterList = useCallback((list) => {
    if (!list || !list.length) return;
    setMasterListCopy(list);
  }, []);

  useEffect(() => {
    socket.on('RECEIVE_OTHER_LIST', (approved) => {
      console.log({ approved });
      if (!approved || approved.length === 0) return;
      //approved list is list of the other users matched restaurants
      console.log({ approved: approved });
      const match = approved.find(({ location_id }) =>
        approvedList.some(
          (currUserItem) => location_id === currUserItem.location_id,
        ),
      );

      console.log({ match });
      if (match) {
        // setMatch(match);
        socket.emit('FOUND_MATCH', match);
      }
    });

    socket.on('MASTER_LIST', handleMasterList);
    socket.on('MATCH', ({ match, message }) => {
      console.log('MATCH', { match, message });
      // setMatch(match);
    });
    // return () => {
    //   socket.off('APPROVED_LIST');
    //   socket.off('MATCH');
    //   socket.off('MASTER_LIST')
    // };
  }, [socket, handleMasterList, approvedList]);

  const handleLeftSwipe = () => {
    if (masterListCopy.length === 0) return;

    const copy = [...masterListCopy];
    copy.push(copy.shift());
    setMasterListCopy(copy);
  };

  // ! WHAT THE HASHROUTER
  const handleRightSwipe = useCallback(() => {
    if (masterListCopy.length === 0) return;
    const updatedApprovedList = approvedList.concat(
      masterListCopy[0],
    );
    setApprovedList(updatedApprovedList);
    setMasterListCopy(
      masterListCopy.filter((item) => item !== masterListCopy[0]),
    );

    socket.emit('RIGHT_SWIPE_LIST', updatedApprovedList);
  }, [approvedList, socket, masterListCopy]);

  if (!masterListCopy.length) return null;
  const { name, phone, website, photo, address } = masterListCopy[0];
  return (
    <div className={style.swipeContainer}>
      <h2 className={style.swipeHeader}>Swipe Left or Right!</h2>
      <div>
        <div>
          <h3>{name}</h3>
          {photo && (
            <img
              src={photo.images.large.url}
              alt={name}
              className={style.images}
            />
          )}
          <div>
            {phone} {address} {website}
          </div>
        </div>
      </div>
      <button onClick={handleLeftSwipe}>Left</button>
      <button onClick={handleRightSwipe}>Right</button>
      {match && (
        <div>
          <h3>Congrats yall decided!</h3>
          <span>How does {match.name} sound?</span>
        </div>
      )}
    </div>
  );
}

export default CardSwipe;
