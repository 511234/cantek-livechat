import {Box, Divider, Flex, Heading, Spacer} from "@chakra-ui/react";
import {UI_MAIN_COLOR} from "./constants";
import {Auth} from "./components/Auth";
import React, {MutableRefObject} from "react";
import {Link} from "react-router-dom";

interface INavbarProps {
    buttonRef: MutableRefObject<any>
    currentUser: any
    isAuth: any
    setIsAuth: any;
    setCurrentUser: any
}

export const Navbar = ({buttonRef, currentUser, isAuth, setCurrentUser, setIsAuth}: INavbarProps) => {

    return (
        <> <Flex minWidth='100%' alignItems='space-between' gap='2'>
            <Box p='4'>
                <Link to='/'>
                    <Heading color={UI_MAIN_COLOR} size='lg'>#Talk About...</Heading>
                </Link>
            </Box>
            <Spacer/>
            <Box p='4'>
                <Auth isAuth={isAuth} ref={buttonRef} setIsAuth={setIsAuth} currentUser={currentUser}
                      setCurrentUser={setCurrentUser}/>
            </Box>
        </Flex>

            <Divider borderColor={UI_MAIN_COLOR}/>
        </>
    )
}