import {FIREBASE_AUTH, FIREBASE_GOOGLE_PROVIDER} from "../firebase.config";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import Cookies from 'universal-cookie'
import {Dispatch, forwardRef, SetStateAction, useImperativeHandle} from "react";
import {Button, HStack, Text} from "@chakra-ui/react";
import {UI_MAIN_COLOR} from "../constants";
import {useNavigate} from "react-router-dom";

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

    const navigate = useNavigate()

    useImperativeHandle(ref, () => ({
        handleAuthClick() {
            handleGoogleAuth()
        }
    }));

    const cookies = new Cookies()

    const handleLogout = () => {
        cookies.remove('auth-token', {path: '/'})
        setCurrentUser({})
        setIsAuth(false)
        navigate('/')
    }

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(FIREBASE_AUTH, FIREBASE_GOOGLE_PROVIDER)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            cookies.set('auth-token', result.user.refreshToken)
            setIsAuth(true)
        } catch (e) {
            console.log('e', e)
        }
    }

    console.log('isAuth in nav', isAuth)

    return (
        <>
            {!isAuth &&
                <Button style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                }} variant="unstyled" color={UI_MAIN_COLOR} onClick={handleGoogleAuth} type="button">Sign In / Up
                    With
                    Google</Button>}
            {isAuth &&
                <div style={{color: "white", display: 'flex', alignItems: 'center', gap: '2rem'}}>
                    <HStack>
                        <Text>You are signed in as:</Text>
                        <Text fontWeight="bold">{currentUser?.displayName}</Text>
                    </HStack>
                    <Button variant="unstyled" color={UI_MAIN_COLOR} onClick={handleLogout}
                            type="button">Logout</Button>
                </div>}
        </>
    )
})