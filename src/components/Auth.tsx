import {FIREBASE_AUTH, FIREBASE_GOOGLE_PROVIDER} from "../firebase.config";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import Cookies from 'universal-cookie'
import {Dispatch, forwardRef, SetStateAction, useImperativeHandle} from "react";
import {Button, Text} from "@chakra-ui/react";
import {UI_MAIN_COLOR} from "../constants";

type Ref = {
    handleAuthClick: () => void
} | null

interface IAuthProps {
    currentUser: any
    isAuth: boolean
    setCurrentUser: Dispatch<SetStateAction<any>>
    setIsAuth: Dispatch<SetStateAction<boolean>>
}

export const Auth = forwardRef<Ref, IAuthProps>(({currentUser, isAuth, setCurrentUser, setIsAuth}, ref) => {

    useImperativeHandle(ref, () => ({
        handleAuthClick() {
            handleGoogleAuth()
        }
    }));

    const cookies = new Cookies()

    const handleLogout = () => {
        cookies.remove('auth-token')
        setCurrentUser({})
        setIsAuth(false)
    }

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(FIREBASE_AUTH, FIREBASE_GOOGLE_PROVIDER)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            cookies.set('auth-token', result.user.refreshToken)
            setIsAuth(true)
        } catch (e) {
            console.log('e', e)
        }
    }

    return (
        <>
            {!isAuth &&
                <Button variant="unstyled" color={UI_MAIN_COLOR} onClick={handleGoogleAuth} type="button">Sign In / Up
                    With
                    Google</Button>}
            {isAuth &&
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                    <Text color='white'>You are signed in as: {currentUser?.displayName}</Text>
                    <Button variant="unstyled" color={UI_MAIN_COLOR} onClick={handleLogout}
                            type="button">Logout</Button>
                </div>}
        </>
    )
})