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
import { useDispatch, useSelector } from 'react-redux';
import { saveRestaurant } from '../../actions/restaurantActions';

// @ts-ignore

function CardSwipe({ masterList = [] }) {
  const userId = useSelector((state) => state.session.user.id);
  // const [approvedList, setApprovedList] = useState([]);
  const [masterListCopy, setMasterListCopy] = useState(masterList);
  const [match, setMatch] = useState(false);
  // const [photoList, setPhotoList] = useState(masterList[0]?.photos);
  const [currPhoto, setCurrPhoto] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const [infoButtonHidden, setinfoButtonHidden] = useState(false);
  const socket = useContext(SocketContext);
  const cardRef = useRef(null);
  const leftSwipe = useRef(null);
  const rightSwipe = useRef(null);
  const rightSwipeList = useRef([]);

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

  const handleReceiveOtherList = useCallback(
    ({ user, approvedList }) => {
      console.log({ approvedList, rightSwipeList });
      console.log(socket.id === user);
      if (socket.id !== user) {
        //approved list is list of the other users matched restaurantsL
        const match = rightSwipeList.current.find(({ place_id }) =>
          approvedList.some(
            (currUserItem) =>
              place_id === currUserItem.place_id &&
              socket.id !== user,
          ),
        );
        console.log({ matchOne: match });
        if (match) {
          socket.emit('FOUND_MATCH', match);
        }
      }
    },
    [],
  );

  useEffect(() => {
    socket.on('RECEIVE_OTHER_LIST', handleReceiveOtherList);

    socket.on('MASTER_LIST', handleMasterList);
    socket.on('MATCH', handleMatch);
    return () => {
      socket.off('APPROVED_LIST');
      socket.off('MATCH');
      socket.off('MASTER_LIST');
    };
  }, [handleMasterList, handleReceiveOtherList, handleMatch, socket]);

  const handleLeftSwipe = () => {
    const copy = [...masterListCopy];
    copy.push(copy.shift());
    setMasterListCopy(copy);
    setCurrPhoto(0);
    // setPhotoList(copy[0].photos);
  };

  const handleRightSwipe = useCallback(() => {
    setMasterListCopy(masterListCopy.slice(1));
    rightSwipeList.current = rightSwipeList.current.concat(
      masterListCopy[0],
    );
    console.log(socket.id);
    setCurrPhoto(0);
    socket.emit('RIGHT_SWIPE_LIST', rightSwipeList.current);
  }, [masterListCopy, socket]);

  const handleSave = () => {
    dispatch(saveRestaurant(match, userId));
  };

  // animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-1500, 1500], [-90, 90]);
  const xInput = [-100, 0, 100];
  const borderColor = useTransform(x, xInput, [
    '3px solid rgb(255, 0, 0)',
    '3px solid rgb(255, 255, 255)',
    '3px solid rgb(3, 209, 0)',
  ]);
  const strokeColor = useTransform(x, xInput, [
    'rgb(225, 9, 67)',
    'rgb(255, 106, 0)',
    'rgb(3, 209, 0)',
  ]);
  const filter = useTransform(
    x,
    [-10, -5, 5, 10],
    [
      'drop-shadow(0 0 0.45rem transparent)',
      'drop-shadow(0 0 0.45rem red)',
      'drop-shadow(0 0 0.45rem grey)',
      'drop-shadow(0 0 0.45rem green)',
    ],
  );
  const svgBackdrop =
    'drop-shadow(0px 10px 5px rgba(255,255,255,0.1))';
  const checkStroke = useTransform(x, [50, 200], [0, 1]);
  const xStroke1 = useTransform(x, [-10, -55], [0, 1]);
  const xStroke2 = useTransform(x, [-50, -100], [0, 1]);

  // intersection api
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
            if (entry.boundingClientRect.x - startX < 0) {
              leftSwipe.current.click();
            } else if (entry.boundingClientRect.x - startX > 80) {
              rightSwipe.current.click();
            }
          }
        });
      },
      {
        threshold: 0.5,
        root: document.querySelector('#boundary'),
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
    if (currPhoto > 9) return;
    setCurrPhoto((old) => old + 1);
  };
  if (!masterList || !masterList.length) return null;
  if (masterList && (!masterListCopy || !masterListCopy.length)) {
    setMasterListCopy(masterList);
    // setPhotoList(masterList[0].photos);
    return null;
  }
  const { name, phone, website, address, rating } = masterListCopy[0];
  return (
    <div className={style.swipeContainer}>
      <h2 className={style.swipeHeader}>Swipe Left or Right!</h2>
      <div className={style.cardContainerContainer} id="boundary">
        <div className={style.cardContainerChild}>
          <motion.div
            ref={cardRef}
            className={`${style.card} card`}
            style={{
              x: x,
              rotate: rotate,
              cursor: 'grab',
              border: borderColor,
              filter: filter,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragTransition={{
              bounceStiffness: 600,
              bounceDamping: 40,
            }}
          >
            {' '}
            <svg className={style.decisionIcon} viewBox="10 10 30 30">
              <motion.path
                fill="none"
                strokeWidth="2"
                stroke={strokeColor}
                d="M14,26 L 22,33 L 35,16"
                // d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"
                strokeDasharray="1"
                strokeLinejoin="round"
                // strokeLinecap="round"
                strokeDashoffset="0"
                style={{
                  pathLength: checkStroke,
                  filter: svgBackdrop,
                }}
              />
              <motion.path
                fill="none"
                strokeWidth="2"
                stroke={strokeColor}
                d="M17,17 L33,33"
                // d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"
                strokeDasharray="1"
                // strokeLinecap="round"
                style={{ pathLength: xStroke1 }}
              />
              <motion.path
                fill="none"
                strokeWidth="2"
                stroke={strokeColor}
                d="M33,17 L17,33"
                strokeDasharray="1"
                // strokeLinecap="round"
                style={{ pathLength: xStroke2 }}
              />
            </svg>
            <img
              src={masterListCopy[0]?.photos?.[currPhoto]}
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
            {currPhoto < 9 && (
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
              {infoButtonHidden ? (
                <h3>{name}</h3>
              ) : (
                <h3 className={style.visibleHeader}>{name}</h3>
              )}
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
            onClick={() => history.go(0)}
          >
            Reload?
          </button>
          <button onClick={() => handleSave()}>Star</button>
        </div>
      </CSSTransition>
    </div>
  );
}

export default CardSwipe;
