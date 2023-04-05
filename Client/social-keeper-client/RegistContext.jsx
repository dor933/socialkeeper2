import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const RegistContext  = createContext();

export default function RegistrationContext(props) {

    const [personaldetails, setPersonalDetails] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [prefferdtimes, setPrefferdTimes] = useState([]);
    const [selectedhobbies, setSelectedHobbies] = useState([]);
    const [possiblefavoritecontacts, setPossibleFavoriteContacts] = useState([]);

    
    return (
        <RegistContext.Provider value={{ personaldetails, setPersonalDetails, selectedImage, setSelectedImage, prefferdtimes, setPrefferdTimes, selectedhobbies, setSelectedHobbies, possiblefavoritecontacts, setPossibleFavoriteContacts }}>
            {props.children}
        </RegistContext.Provider>
    )

}
