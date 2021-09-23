import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { SocketContext } from '../../context/socket';
import style from './cardswipe.module.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import placeHolder from '../../assets/images/DanPic.png';
import swipeLeft from '../../assets/images/swipeLeft.png';
import swipeRight from '../../assets/images/swipeRight.png';

// @ts-ignore

function CardSwipe({ masterList = [] }) {
  const [approvedList, setApprovedList] = useState([]);
  const [masterListCopy, setMasterListCopy] = useState(masterList);
  const [match, setMatch] = useState(null);
  const socket = useContext(SocketContext);
  const cardRef = useRef(null);
  const leftSwipe = useRef(null);
  const rightSwipe = useRef(null);
  let startX = useRef(null);

  const handleMasterList = useCallback((list) => {
    if (!list || !list.length) return;
    setMasterListCopy(list);
  }, []);

  const handleMatch = useCallback(({ match }) => {
    setMatch(match);
  }, []);

  useEffect(() => {
    socket.on(
      'RECEIVE_OTHER_LIST',
      ({ user, approvedList: otherUserList }) => {
        if (!otherUserList || !otherUserList.length) return;
        if (socket.id === user) return;
        //approved list is list of the other users matched restaurants
        const match = approvedList.find(({ location_id }) =>
          otherUserList.some(
            (currUserItem) =>
              location_id === currUserItem.location_id,
          ),
        );
        if (match) {
          socket.emit('FOUND_MATCH', match);
        }
      },
    );

    socket.on('MASTER_LIST', handleMasterList);
    socket.on('MATCH', handleMatch);
    return () => {
      socket.off('APPROVED_LIST');
      socket.off('MATCH');
      socket.off('MASTER_LIST');
    };
  }, [approvedList, handleMasterList, socket, handleMatch]);

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
      masterListCopy.filter(
        ({ location_id }) =>
          location_id !== masterListCopy[0].location_id,
      ),
    );
    socket.emit('RIGHT_SWIPE_LIST', updatedApprovedList);
  }, [masterListCopy, approvedList]);

  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ff008c', '#7700ff', 'rgb(230, 255, 0)'],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          document.querySelector('.card')
            ? (startX =
                (window.innerWidth -
                  document.querySelector('.card').clientWidth) /
                2)
            : (startX = 0);
          // startX =
          //   (window.innerWidth -
          //     document.querySelector('.card').clientWidth) /
          //   2;
          if (!entry.isIntersecting) {
            console.log(startX);
            console.log(entry.boundingClientRect.x);
            if (entry.boundingClientRect.x - startX < 0) {
              leftSwipe.current.click();
              console.log('left');
            } else if (entry.boundingClientRect.x - startX > 80) {
              rightSwipe.current.click();
              console.log('right');
            }
          }
        });
      },
      {
        threshold: 0.5,
        root: document.querySelector('#idklol'),
        rootMargin: '0px',
      },
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  if (!masterListCopy.length) return null;
  const { name, phone, website, photo, address } = masterListCopy[0];
  console.log(masterListCopy);
  return (
    <div className={style.swipeContainer}>
      <h2 className={style.swipeHeader}>Swipe Left or Right!</h2>
      <div className={style.cardContainerContainer} id="idklol">
        <div className={style.cardContainerChild}>
          <motion.div
            ref={cardRef}
            className={`${style.card} card`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
          >
            <h3>{name}</h3>
            <img
              src={photo ? photo.images.large.url : placeHolder}
              alt={name}
              className={style.images}
            />
            <button ref={leftSwipe} onClick={handleLeftSwipe}>
              <img
                className={style.leftSwipe}
                src={swipeLeft}
                alt="swipeLeft"
              />
            </button>
            <button ref={rightSwipe} onClick={handleRightSwipe}>
              <img
                className={style.swipe}
                src={swipeRight}
                alt="swipeRight"
              />
            </button>
          </motion.div>
          <div>
            {phone} {address} {website}
          </div>
        </div>
      </div>
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
