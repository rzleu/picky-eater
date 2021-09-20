import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// @ts-ignore
const socket = io(`http://${window.location.hostname}:3001`);

function Lobby() {
  const [selections, setSelections] = useState([
    'Sushi',
    'Pizza',
    'Sauasge',
    'Durian',
  ]);
  const [currSelection, setCurrSelection] = useState('');
  const [match, setMatch] = useState('');

  useEffect(() => {
    socket.on('approved-list', (approved) => {
      // if (approved.some((item) => item === currSelection)) {
      console.log(approved);
      console.log('hello');
      //   setMatch(currSelection);
      // }
    });
  });

  const removeAndSelectNext = () => {
    setSelections((oldSelections) =>
      oldSelections.filter((select) => select !== currSelection),
    );
    setCurrSelection(selections[0]);
  };

  const handleLeftSwipe = () => removeAndSelectNext();

  const handleRightSwipe = () => {
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
