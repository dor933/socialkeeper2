import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const MainAppcontext  = createContext();

export default function MainAppcontextfunc(props) {

    const [user, setUser] = useState({});
    const [userevents, setUserevents] = useState([]);
    const [firebaseuser, setFirebaseuser] = useState({});
    const [suggestedmeeting, setSuggestedmeeting] = useState({});
    const [suggestedmeeting1, setSuggestedmeeting1] = useState({});
    const [isappready, setIsappready] = useState(false);

    
    return (
        <MainAppcontext.Provider value={{ user,setUser,userevents,setUserevents, firebaseuser, setFirebaseuser, suggestedmeeting, setSuggestedmeeting, suggestedmeeting1, setSuggestedmeeting1,isappready,setIsappready }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}