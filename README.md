# pickyEatr

[pickyEatr](https://picky-eatr.herokuapp.com/#/) is the solution to one of humanity's greatest problems: what should we eat?? Enter pickyEatr: an application where you and your friend swipe on local restaurants in the area until a match is made. 

<img width="1440" alt="Screen Shot 2021-09-26 at 7 57 27 PM" src="https://user-images.githubusercontent.com/84679041/134831203-af18a95c-99f8-4b27-8037-307bf68a9440.png">
<img width="1440" alt="Screen Shot 2021-09-26 at 7 58 05 PM" src="https://user-images.githubusercontent.com/84679041/134831228-e1a5f565-a868-4a62-afd4-df169a042a2c.png">

## Core Technolgies 
- MongoDB
- Mongoose
- Express.js 
- React Hooks 
- Node.js
- HTML5
- CSS3

### Additional Technologies
- Axios as a Promise based HTTP client for the browser and Node.js.
- Socket.io used to implement WebSockets to create rooms for a pair of users to swipe on what's right.
- Google Places API to extract geolocated restaurant data local to the users.
- Intersection API 
- Framer Motion

## Features


## Highlights
The following code is the aynchronous call to extract the data from the Google Places API. In order to successfully extract the restaurant details and photos for a user's nearby restaurants. An initial request to extract the ```place_id``` was needed throught Google Nearby Search API and then the following Google Place Details and Photos API HTTP requests using the ```place_id``` and ```photo_reference``` data could appropriately consolidate all needed information.
```js
  async function success(pos) {
    setFetchingData(true);

    const placeIdOptions = {
      method: 'GET',
      url: `https://gentle-thicket-64456.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pos.coords.latitude}%2C${pos.coords.longitude}&keyword=restaurant&type=food&radius=8000&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
      headers: {},
    };

    try {
      const placeIds = await axios(placeIdOptions)
        .then((data) => {
          return data.data.results.map(({ place_id }) => {
            return place_id;
          });
        })
        .catch((error) => {
          console.log(error);
        });

      const restaurants = placeIds.map(async (placeId) => {
        const placeDetailOptions = {
          method: 'GET',
          url: `https://gentle-thicket-64456.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
          headers: {},
        };

        const placeDetails = await axios(placeDetailOptions)
          .then((data) => {
            return data.data.result;
          })
          .catch((error) => {
            console.log(error);
          });

        return placeDetails;
      });

      const resDetails = (await Promise.all(restaurants)).map(
        (data) => {
          return {
            name: data.name,
            address: data.vicinity,
            phone: data.formatted_phone_number,
            location: data.geometry.location,
            photoRefs: data.photos
              .map((photo) => {
                return photo.photo_reference;
              })
              .sort(() => 0.5 - Math.random())
              .slice(0, 3),
            rating: data.rating,
            website: data.website,
          };
        },
      );
      setMasterList(resDetails);
      setFetchingData(false);
    } catch (error) {
      console.error(error);
    }
  }
```
