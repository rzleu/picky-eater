import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { SocketContext } from '../../context/socket';
import style from './cardswipe.module.css';

// @ts-ignore

function CardSwipe({
  categories = ['Sushi', 'Pizza', 'Sausage', 'Durian'],
}) {
  const [selections, setSelections] = useState(categories);
  const [currSelection, setCurrSelection] = useState('');
  const [match, setMatch] = useState('');
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('APPROVED_LIST', (approved) => {
      //approved list is list of matched restaurants
      if (approved.some((item) => item && item === currSelection)) {
        console.log(approved);
        setMatch(currSelection);
      }
    });
    return () => {
      socket.off('APPROVED_LIST');
    };
  }, [currSelection, socket]);

  const removeAndSelectNext = () => {
    // console.log(selections);
    const filteredItems = selections.filter(
      (selection) => selection !== currSelection,
    );
    setSelections(filteredItems);
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

  return (
    <div className={style.swipeContainer}>
      <h2>Swipe Left or Right!</h2>
      <div className="cardContainer">
        <div>{currSelection}</div>
        <button onClick={handleLeftSwipe}>Left</button>
        <button onClick={handleRightSwipe}>Right</button>
      </div>
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
