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
  const [masterList, setMasterList] = useState([]);
  const [currSelection, setCurrSelection] = useState('');
  const [match, setMatch] = useState('');
  const socket = useContext(SocketContext);

  const handleMasterList = useCallback((list) => {
    setMasterList(list);
  }, []);

  useEffect(() => {
    socket.on('APPROVED_LIST', (approved) => {
      //approved list is list of matched restaurants
      if (approved.some((item) => item && item === currSelection)) {
        console.log(approved);
        setMatch(currSelection);
      }
    });

    socket.on('MASTER_LIST', handleMasterList);

    return () => {
      socket.off('APPROVED_LIST');
    };
  }, [currSelection, socket, handleMasterList]);

  const removeAndSelectNext = () => {
    // console.log(selections);
<<<<<<< HEAD
    const filteredItems = selections.filter(
      (selection) => selection !== currSelection,
    );
    setSelections(filteredItems);
=======
    const filteredItems = masterList.filter(
      (selection) => selection !== currSelection,
    );
    setMasterList(filteredItems);
>>>>>>> origin/main
    setCurrSelection(filteredItems[0]);
  };

  const handleLeftSwipe = () => removeAndSelectNext();

  const handleRightSwipe = useCallback(() => {
    socket.emit('right-swipe', {
      selection: currSelection,
    });
    removeAndSelectNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(masterList);
  return (
<<<<<<< HEAD
    <div className={style.swipeContainer}>
      <h2>Swipe Left or Right!</h2>
      <div className="cardContainer">
        <div>{currSelection}</div>
        <button onClick={handleLeftSwipe}>Left</button>
        <button onClick={handleRightSwipe}>Right</button>
      </div>
=======
    <div>
      <h2>Swipe Left or Right!</h2>
      {currSelection}
      <button onClick={handleLeftSwipe}>Left</button>
      <button onClick={handleRightSwipe}>Right</button>
>>>>>>> origin/main
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
