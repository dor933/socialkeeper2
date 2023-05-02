import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import firebaseInstance from '..//Firebase//firebaseconfig.js';
import axios from 'axios';



const getPlaceDetails = async (placeId) => {
    const fileName = `${placeId}.json`;
    // Create a reference to the file we want to download
    const fileRef = ref(firebaseInstance.storage, `Places/${fileName}`);
   
  
    try {
      // Check if the file exists in Firebase Storage
      const url = await getDownloadURL(fileRef);
  
      // Fetch the JSON file from Firebase Storage
      const response = await axios.get(url);
     
      return response.data;
    }
     catch (error) {
    {
        console.error('Error retrieving file from Firebase Storage:', error);
      }
    }
  
  };



    export { getPlaceDetails };