import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore, collection, getDocs, doc,getDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";





const firebaseConfig = {
    apiKey: "AIzaSyDA-GbcFjJNNLqEFteW3ic3l9s7zhpbKwA",
    authDomain: "responsive-cab-377615.firebaseapp.com",
    projectId: "responsive-cab-377615",
    storageBucket: "responsive-cab-377615.appspot.com",
    messagingSenderId: "923332378077",
    appId: "1:923332378077:web:90aafdf4ac7980836c4a34",
    measurementId: "G-RGDBVLPS8S"
  };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const storage = getStorage(app);

    const firebaseInstance = {
        auth,
        firestore,
        storage,
        collection,
        getDocs,
        doc,
        writeBatch,
        deleteDoc,
        GoogleAuthProvider,
        FacebookAuthProvider,
        signInWithCredential,
        getDoc
      };


    export default firebaseInstance;
