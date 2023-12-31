import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {Room} from "./components/Room";
import {Home} from "./Home";
import Cookies from "universal-cookie";
import {Navbar} from "./Navbar";
import {onAuthStateChanged} from "firebase/auth";
import {FIREBASE_AUTH} from "./firebase.config";

function App() {
    const cookies = new Cookies()
    const [currentUser, setCurrentUser] = useState<any>()
    const [isAuth, setIsAuth] = useState(() => !!cookies.get('auth-token'))

    const buttonRef = useRef<any>(null)

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                // https://firebase.google.com/docs/reference/js/auth.user
                const displayName = user?.displayName || '';
                const uid = user.uid
                setCurrentUser({displayName, uid})
                cookies.set('auth-token', user.refreshToken)
                setIsAuth(true)
            } else {
                setCurrentUser({})
                setIsAuth(false)
            }
        });
    }, [])

    return (
        <>
            <Navbar buttonRef={buttonRef} currentUser={currentUser} setCurrentUser={setCurrentUser} isAuth={isAuth}
                    setIsAuth={setIsAuth}/>
            <Routes>
                <Route path="/" element={<Home buttonRef={buttonRef} currentUser={currentUser} isAuth={isAuth}
                                               setCurrentUser={setCurrentUser}/>}
                />
                <Route path="/rooms/:room" element={<Room isAuth={isAuth} currentUser={currentUser}/>}/>
            </Routes>
        </>

    );
}

export default App;
