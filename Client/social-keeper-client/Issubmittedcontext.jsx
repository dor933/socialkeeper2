import React from "react";
import { useState, useContext } from "react";


//create use context
export const IsSubmittedContext = React.createContext();

export default function IsSubmittedContextFunc(props) {

    const [issubmitted, setIssubmitted] = useState(false);

    return (
        <IsSubmittedContext.Provider value={{issubmitted, setIssubmitted}}>
            {props.children}
        </IsSubmittedContext.Provider>
    )
}

