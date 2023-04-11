import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const RegistContext  = createContext();

export default function RegistrationContext(props) {

    const [personaldetails, setPersonalDetails] = useState({});
    const [imagetype , setImageType] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [prefferdtimes, setPrefferdTimes] = useState([]);
    const [selectedhobbies, setSelectedHobbies] = useState([]);
    const [possiblefavoritecontacts, setPossibleFavoriteContacts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [alreadymembers, setAlreadyMembers] = useState([]);
    const [invitedcontacts,setInvitedContacts]=useState([])
    const [filteredalreadymebers,setFilteredAlreadyMembers]=useState([])



    
    return (
        <RegistContext.Provider value={{ contacts,filteredalreadymebers,setFilteredAlreadyMembers,setContacts,filteredContacts,setFilteredContacts,alreadymembers,setAlreadyMembers,invitedcontacts,setInvitedContacts, personaldetails,imagetype,setImageType, setPersonalDetails, selectedImage, setSelectedImage, prefferdtimes, setPrefferdTimes, selectedhobbies, setSelectedHobbies, possiblefavoritecontacts, setPossibleFavoriteContacts }}>
            {props.children}
        </RegistContext.Provider>
    )

}
