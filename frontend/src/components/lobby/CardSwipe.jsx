import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { SocketContext } from '../../context/socket';
import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import style from './cardswipe.module.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'react-feather';
import leftSwipeBtn from '../../assets/svg/x.svg';
import rightSwipeBtn from '../../assets/svg/heart.svg';

// @ts-ignore

function CardSwipe({ masterList = [] }) {
  const [approvedList, setApprovedList] = useState([]);
  const [masterListCopy, setMasterListCopy] = useState(masterList);
  const [match, setMatch] = useState(false);
  const [photoList, setPhotoList] = useState(
    masterList[0]?.photoRefs,
  );
  const history = useHistory();
  const [currPhoto, setCurrPhoto] = useState(0);
  const [infoButtonHidden, setinfoButtonHidden] = useState(false);
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
    console.log({ match });
    setMatch(match);
    socket.off('APPROVED_LIST');
    socket.off('MATCH');
    socket.off('MASTER_LIST');
  }, []);

  const handleInfoButton = () => {
    setinfoButtonHidden(!infoButtonHidden);
  };

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
  }, [approvedList, handleMatch]);

  const handleLeftSwipe = () => {
    if (masterListCopy.length === 0) return;

    const copy = [...masterListCopy];
    copy.push(copy.shift());
    setMasterListCopy(copy);
    setCurrPhoto(0);
    setPhotoList(copy[0].photoRefs);
  };

  // ! WHAT THE HASHROUTER
  const handleRightSwipe = useCallback(() => {
    if (masterListCopy.length === 0) return;
    const updatedApprovedList = approvedList.concat(
      masterListCopy[0],
    );
    const sliced = masterListCopy.slice(1);
    setMasterListCopy(sliced);
    setApprovedList(updatedApprovedList);
    setPhotoList(sliced[0].photoRefs);
    setCurrPhoto(0);
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

  const handlePhotoLeftClick = () => {
    if (currPhoto < 1) return;
    setCurrPhoto((old) => old - 1);
  };

  const handlePhotoRightClick = () => {
    if (currPhoto > 2) return;
    setCurrPhoto((old) => old + 1);
  };
  console.log({ masterListCopy });
  if (!masterList || !masterList.length) return null;
  if (masterList && (!masterListCopy || !masterListCopy.length)) {
    setMasterListCopy(masterList);
    setPhotoList(masterList[0].photoRefs);
    return;
  }
  const { name, phone, website, address, rating } = masterListCopy[0];

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
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoList[currPhoto]}&maxwidth=500&key=${process.env.REACT_APP_GOOGLE_API_KEY}`}
              alt={name}
              className={style.images}
            />
            {currPhoto !== 0 && (
              <button
                className={style.photoLeftBtn}
                onClick={handlePhotoLeftClick}
              >
                <ChevronLeft size={64} strokeWidth={3} />
              </button>
            )}
            {currPhoto < 2 && (
              <button
                className={style.photoRightBtn}
                onClick={handlePhotoRightClick}
              >
                <ChevronRight strokeWidth={3} size={64} />
              </button>
            )}
            <div
              className={style.swipeBar}
              style={{ bottom: infoButtonHidden ? '33%' : '12%' }}
            >
              <button ref={leftSwipe} onClick={handleLeftSwipe}>
                <img
                  className={style.leftSwipe}
                  src={leftSwipeBtn}
                  alt="swipeLeft"
                />
              </button>
              <button
                className={style.infoCircle}
                onClick={handleInfoButton}
              >
                <Info size={36} strokeWidth={3} />
              </button>
              <button ref={rightSwipe} onClick={handleRightSwipe}>
                <img src={rightSwipeBtn} alt="right" />
              </button>
            </div>
            <div className={style.infoBlock}>
              <h3>{name}</h3>
              {infoButtonHidden && (
                <div className={style.testing}>
                  <p>Rating: {rating}</p>
                  <p>Phone Number: {phone}</p>
                  <p>Address: {address}</p>
                  <p>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <CSSTransition
        in={!!match}
        timeout={400}
        unmountOnExit
        classNames="match"
      >
        <div className={style.matchContainer}>
          <div>
            <div className={style.matchHeading}>
              <h3>You've got a match!</h3>
              <span>
                How does{' '}
                <a href={website} rel="noreferrer" target="_blank">
                  {match.name}
                </a>{' '}
                sound?
              </span>
            </div>

            <div className={style.bg} />
          </div>
          <button
            className={style.reload}
            onClick={() => history.push('/')}
          >
            Reload?
          </button>
        </div>
      </CSSTransition>
    </div>
  );
}

export default CardSwipe;
