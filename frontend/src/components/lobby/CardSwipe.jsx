import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { SocketContext } from '../../context/socket';
import style from './cardswipe.module.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';

let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      /* Placeholder replacement */
      console.log('it has touched');
    });
  },
  {
    threshold: 0.8,
    root: document.querySelector('#idklol'),
    rootMargin: '0px',
  },
);

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
        // console.log(approved);
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
    const filteredItems = masterList.filter(
      (selection) => selection !== currSelection,
    );
    setMasterList(filteredItems);
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
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ff008c', '#7700ff', 'rgb(230, 255, 0)'],
  );

  useEffect(() => {
    document.querySelectorAll('.card').forEach((card) => {
      observer.observe(card);
    });
  });

  return (
    <div className={style.swipeContainer}>
      <h2 className={style.swipeHeader}>Swipe Left or Right!</h2>
      <div className={style.cardContainerContainer}>
        <div className={style.cardContainer} id="idklol">
          <motion.div
            className={`${style.card} card`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
          >
            {currSelection} test
          </motion.div>
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
