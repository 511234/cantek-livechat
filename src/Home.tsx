import {Center, Flex, Grid, Heading, Spinner} from "@chakra-ui/react";
import {UI_MAIN_COLOR} from "./constants";
import {RoomDoor} from "./components/RoomDoor";
import React, {MutableRefObject, useEffect, useMemo, useState} from "react";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {FIREBASE_DB} from "./firebase.config";
import {Link} from "react-router-dom";

interface IHomeProps {
    buttonRef: MutableRefObject<any>
    currentUser: any
    isAuth: boolean
    setCurrentUser: any
}

export const Home = ({buttonRef, currentUser, isAuth, setCurrentUser}: IHomeProps) => {

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [rooms, setRooms] = useState<string[]>([])
    const messagesRef = collection(FIREBASE_DB, "messages");

    const handleTextClick = () => {
        buttonRef?.current?.handleAuthClick()
    }

    const actionMessage = useMemo(() => isAuth ? "Create" : "Sign In", [isAuth])
    const actionFunction = useMemo(() => isAuth ? handleModalOpen : handleTextClick, [isAuth])

    useEffect(() => {

        const queryMessages = query(
            messagesRef,
            orderBy("createdAt")
        );

        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let msgs: any[] = [];
            let rms = new Set()
            snapshot.forEach((doc) => {
                rms.add(doc.data().room)
                msgs.push({...doc.data(), id: doc.id});
            });
            const strArrRooms = Array.from(rms) as string[]
            setRooms(strArrRooms)
            setMessages(messages);
            setIsLoading(false)
        });

        return () => unsuscribe();
    }, []);

    return (

        <div className="App">


            <Heading color={UI_MAIN_COLOR} as='span' py='6' px="2" size='md'>Have a topic in mind?</Heading>
            <Heading color='white' as='button' py='6' px="1" size='md'
                     onClick={actionFunction}>{actionMessage}</Heading>
            <Heading color={UI_MAIN_COLOR} as='span' py='6' px="2" size='md'>to start a conversation!</Heading>

            {isLoading &&
                <Flex justify="center">
                    <Center>
                        {/* Label for SR only */}
                        <Spinner label="Loading chat rooms" color="white" size="xl"/>
                    </Center>
                </Flex>}
            {!isLoading &&
                <Grid templateColumns='1fr' gap={6} px={4}>
                    {rooms.map((val) =>
                        <Link key={val} to={`/rooms/${val}`}>
                            <RoomDoor key={val} text={val}/>
                        </Link>
                    )}
                </Grid>
            }
        </div>
    )

}