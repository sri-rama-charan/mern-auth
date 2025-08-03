import {createContext, useState} from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = 'http://localhost:4000';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState('');

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
