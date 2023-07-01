import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
//import get signed url
import firebaseInstance from '..//Firebase//firebaseconfig.js';
import axios from 'axios';
global.Buffer = global.Buffer || require('buffer').Buffer;




const getPlaceDetails = async (placeId) => {
    const fileName = `${placeId}`;
    console.log('placeid', placeId)
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
      console.error('Error retrieving file from Firebase Storage:', error.message);
      console.error('Error details:', error.response.data);
      }
    }
  
  };

  const savePlace = async (result) => {
    const db = firebaseInstance.firestore;
    const apikey='AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow';
    const storage= firebaseInstance.storage;


    const docRef = firebaseInstance.doc(db, 'Places', result.place_id);
    console.log('docRef', docRef);
    const docSnapshot = await firebaseInstance.getDoc(docRef);
    console.log('docSnapshot', docSnapshot);

    if (!docSnapshot.exists()) {
   
      const batch = firebaseInstance.writeBatch(db);
      batch.set(docRef, {
        Placeid: result.place_id,
        longitude: result.geometry.location.lng,
        latitude: result.geometry.location.lat,
        type: result.types[0]
      });
      await batch.commit();
      const placeblob = Buffer.from(JSON.stringify(result), "utf-8");
      const storageref= ref(storage, `Places/${result.place_id}`);
      console.log('storageref', storageref);
      const UploadTask= await uploadBytes(storageref, placeblob, {contentType: 'application/json'})
      console.log('UploadTask', UploadTask);
      try{
        const snapshot= await UploadTask;
        const downloadurl= await getDownloadURL(snapshot.ref);
        console.log('downloadurl', downloadurl);
      }
      catch(error){
        console.log('error', error);
      }

    }
    else{
      console.log('place already exists');
    }

  };



    export { getPlaceDetails,savePlace };