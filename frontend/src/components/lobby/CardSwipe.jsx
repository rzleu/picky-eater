import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { SocketContext } from '../../context/socket';

// @ts-ignore

function Lobby({
  categories = ['Sushi', 'Pizza', 'Sausage', 'Durian'],
}) {
  const [selections, setSelections] = useState(categories);
  const [currSelection, setCurrSelection] = useState('');
  const [match, setMatch] = useState('');
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('approved-list', (approved) => {
      if (approved.some((item) => item && item === currSelection)) {
        console.log(approved);
        setMatch(currSelection);
      }
    });
    return () => {
      socket.off('approved-list');
    };
  }, [currSelection, socket]);

  const removeAndSelectNext = () => {
    // console.log(selections);
    const filteedItems = selections.filter(
      (selection) => selection !== currSelection,
    );
    setSelections(filteedItems);
    setCurrSelection(filteedItems[0]);
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
    <div>
      <h2>Swipe Left or Righ!</h2>
      {currSelection}
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

export default Lobby;
