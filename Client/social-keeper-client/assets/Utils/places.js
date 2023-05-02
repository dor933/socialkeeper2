import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import firebaseInstance from '..//Firebase//firebaseconfig.js';
import axios from 'axios';



const getPlaceDetails = async (placeId, apiKey) => {
    const fileName = `${placeId}.json`;
    // Create a reference to the file we want to download
    const fileRef = ref(firebaseInstance.storage, `Places/${fileName}`);
   
  
    try {
      // Check if the file exists in Firebase Storage
      const url = await getDownloadURL(fileRef);
  
      // Fetch the JSON file from Firebase Storage
      const response = await axios.get(url);
      console.log('this is response data')
        console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        // File not found, fetch data from Google Places API
        const placeDetails = await fetchPlaceDetails(placeId, apiKey);
  
        if (placeDetails) {
          // Save the JSON file in Firebase Storage
          const blob = new Blob([JSON.stringify(placeDetails)], { type: 'application/json' });
          const responsefile= await uploadBytes(fileRef, blob);
            console.log("responsefile",responsefile);
  
          return placeDetails;
        }
      } else {
        console.error('Error retrieving file from Firebase Storage:', error);
      }
    }
  
    return null;
  };

  const fetchPlaceDetails = async (placeId, apiKey) => {
    try {
        console.log("fetchPlaceDetails");
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

    export { getPlaceDetails };