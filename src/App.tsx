import React, {useRef, useState} from 'react';
import './App.css';
import {Auth} from "./components/Auth";
import {Box, Divider, Flex, Heading, Spacer} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import {UI_MAIN_COLOR} from "./constants";

function App() {
    const cookies = new Cookies()

    const [isAuth, setIsAuth] = useState(!!cookies.get('auth-token'))
    const [room, setRoom] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const buttonRef = useRef<any>(null)

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const handleTextClick = () => {
        buttonRef?.current?.handleAuthClick()
    }

    const ACTION_MESSAGE = isAuth ? "Create" : "Sign In"
    const ACTION_FUNCTION = isAuth ? handleModalOpen : handleTextClick

    return (
        <div className="App">
            <Flex minWidth='max-content' alignItems='space-between' gap='2'>
                <Box p='4'>
                    <Heading color={UI_MAIN_COLOR} size='lg'>#Talk About...</Heading>
                </Box>
                <Spacer/>
                <Box p='4'>
                    <Auth isAuth={isAuth} ref={buttonRef} setIsAuth={setIsAuth}/>
                </Box>
            </Flex>

            <Divider borderColor={UI_MAIN_COLOR}/>
            <Heading color={UI_MAIN_COLOR} as='span' py='6' px="2" size='md'>Have a topic in mind?</Heading>
            <Heading color='white' as='button' py='6' px="1" size='md'
                     onClick={ACTION_FUNCTION}>{ACTION_MESSAGE}</Heading>
            <Heading color={UI_MAIN_COLOR} as='span' py='6' px="2" size='md'>to start a conversation!</Heading>

        </div>
    );
}

export default App;
