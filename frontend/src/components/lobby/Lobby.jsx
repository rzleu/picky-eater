import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// @ts-ignore
const socket = io(`http://${window.location.hostname}:3001`);

function Lobby({
  categories = ['Sushi', 'Pizza', 'Sausage', 'Durian'],
}) {
  const [selections, setSelections] = useState(categories);
  const [currSelection, setCurrSelection] = useState('');
  const [match, setMatch] = useState('');

  useEffect(() => {
    socket.on('approved-list', (approved) => {
      if (approved.some((item) => item && item === currSelection)) {
        console.log(approved);
        setMatch(currSelection);
      }
    });
  }, [currSelection]);

  const removeAndSelectNext = () => {
    // console.log(selections);
    const filteedItems = selections.filter(
      (selection) => selection !== currSelection,
    );
    setSelections(filteedItems);
    setCurrSelection(filteedItems[0]);
  };

  const handleLeftSwipe = (e) => removeAndSelectNext();

  const handleRightSwipe = (e) => {
    e.preventDefault();
    socket.emit('right-swipe', {
      selection: currSelection,
    });
    removeAndSelectNext();
  };
  return (
    <div>
      <h2>Swipe Left or Righ!</h2>
      {currSelection}
      <button onClick={handleLeftSwipe}>Left</button>
      <button onClick={(e) => handleRightSwipe(e)}>Right</button>
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
