import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { SocketContext } from '../../context/socket';
import style from './cardswipe.module.css';

// @ts-ignore

function CardSwipe() {
  const [approvedList, setApprovedList] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [match, setMatch] = useState('');
  const socket = useContext(SocketContext);

  const handleMasterList = useCallback((list) => {
    console.log({ list });
    if (!list || !list.length) return;
    setMasterList(list);
  }, []);

  useEffect(() => {
    socket.on('APPROVED_LIST', (approved) => {
      //approved list is list of the other users matched restaurants
      const match = approved.find((value) =>
        approvedList.includes(value),
      );
      if (match) {
        // setMatch(match);
        socket.emit('FOUND_MATCH', match);
      }
    });

    socket.on('MASTER_LIST', handleMasterList);

    return () => {
      socket.off('APPROVED_LIST');
    };
  }, [socket, handleMasterList, approvedList]);

  const handleLeftSwipe = () => {
    console.log('chje', { masterList });
    if (masterList.length === 0) return;

    const copy = [...masterList];
    copy.push(copy.shift());
    setMasterList(copy);
  };

  const handleRightSwipe = useCallback(() => {
    if (masterList.length === 0) return;
    const updatedApprovedList = approvedList.concat(masterList[0]);
    console.log({ updatedApprovedList });
    setApprovedList(updatedApprovedList);
    setMasterList(
      masterList.filter((item) => item !== masterList[0]),
    );
    socket.emit('RIGHT_SWIPE_LIST', updatedApprovedList);
  }, [approvedList, socket, masterList]);

  console.log(masterList);
  if (!masterList.length) return null;
  const { name, phone, website, photo, address } = masterList[0];
  console.log({ photo });
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
          <span>How does {match} sound?</span>
        </div>
      )}
    </div>
  );
}

export default CardSwipe;
