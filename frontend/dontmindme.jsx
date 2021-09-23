useEffect(() => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        startX =
          (window.innerWidth -
            document.querySelector('.card').clientWidth) /
          2;
        console.log({ entry });
        if (!entry.isIntersecting) {
          console.log(startX);
          console.log(entry.boundingClientRect.x);
          if (entry.boundingClientRect.x - startX < 0) {
            console.log('touched left');
          } else if (entry.boundingClientRect.x - startX > 80) {
            console.log('touched right');
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

// styles

.swipeHeader {
  margin: 0;
}

.swipeContainer {
  background: rgb(70, 70, 70);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  height: 300px;
  width: 300px;
  background: white;
}

.cardContainer {
  width: 100%;
  height: 200px;
  /* overflow: hidden; */
}

.cardContainerContainer {
  height: 100%;
  width: 20%;
  display: grid;
  place-items: center;
  justify-content: center;
}

#idklol {
}