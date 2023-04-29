import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const MainAppcontext  = createContext();

export default function MainAppcontextfunc(props) {

    const [user, setUser] = useState({});
    const [userevents, setUserevents] = useState([]);
    const [firebaseuser, setFirebaseuser] = useState({});
    const [suggestedmeeting, setSuggestedmeeting] = useState({});
    const [suggestedmeeting1, setSuggestedmeeting1] = useState({});

    
    return (
        <MainAppcontext.Provider value={{ user,setUser,userevents,setUserevents, firebaseuser, setFirebaseuser, suggestedmeeting, setSuggestedmeeting, suggestedmeeting1, setSuggestedmeeting1 }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}