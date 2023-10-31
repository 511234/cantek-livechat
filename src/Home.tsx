import {Button, Center, Flex, Grid, GridItem, Heading, Spinner, useDisclosure} from "@chakra-ui/react";
import {UI_MAIN_COLOR} from "./constants";
import React, {MutableRefObject, useEffect, useMemo, useRef, useState} from "react";
import {addDoc, collection, onSnapshot, query, serverTimestamp} from "firebase/firestore";
import {FIREBASE_DB} from "./firebase.config";
import {Link} from "react-router-dom";
import {CreateModal} from "./components/CreateModal";
import {MemberList} from "./components/MemberList";

interface IHomeProps {
    buttonRef: MutableRefObject<any>
    currentUser: any
    isAuth: boolean
    setCurrentUser: any
}

export const Home = ({buttonRef, currentUser, isAuth, setCurrentUser}: IHomeProps) => {

    const {isOpen, onOpen, onClose} = useDisclosure()

    const [isLoading, setIsLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState<any[]>([])
    const [rooms, setRooms] = useState<string[]>([])
    const membersRef = collection(FIREBASE_DB, "members");
    const messagesRef = collection(FIREBASE_DB, "messages");
    const initialRef = useRef<HTMLInputElement>(null)

    const handleTextClick = () => {
        buttonRef?.current?.handleAuthClick()
    }

    const actionMessage = useMemo(() => isAuth ? "Create a Topic" : "Sign In", [isAuth])
    const actionFunction = useMemo(() => isAuth ? onOpen : handleTextClick, [isAuth])

    useEffect(() => {

        const queryMessages = query(
            messagesRef,
        );

        const queryMembers = query(
            membersRef,
        );

        const unsuscribeMembers = onSnapshot(queryMembers, (snapshot) => {
            let ms: any[] = [];
            snapshot.forEach((doc) => {
                ms.push({...doc.data(), id: doc.id});
            });

            setMembers(ms);
            setIsLoading(false)
        });


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

        return () => {
            unsuscribe();
            unsuscribeMembers();
        }
    }, []);

    useEffect(() => {
        if (!currentUser?.uid || members.length === 0) {
            return
        }

        if (members.find((member) => member.uid === currentUser.uid)) {
            return
        }

        addDoc(membersRef, {
            createdAt: serverTimestamp(),
            displayName: currentUser?.displayName,
            uid: currentUser?.uid,
        });

    }, [currentUser, members])

    return (

        <div className="App">

            <Flex>

                <div style={{flexGrow: 4}}>
                    <Flex justify="center" direction="row">
                        <Heading color={UI_MAIN_COLOR} as='span' py='6' px="1" size='md'>Have a topic in
                            mind?</Heading>
                        <Heading color='white' as='button' py='6' px="1" size='md'
                                 onClick={actionFunction}>{actionMessage}</Heading>
                        <Heading color={UI_MAIN_COLOR} as='span' py='6' px="2" size='md'>to start a
                            conversation!</Heading>
                    </Flex>

                    <CreateModal currentUser={currentUser} initialRef={initialRef} isOpen={isOpen}
                                 onClose={onClose}/>

                    {isLoading &&
                        <Flex justify="center">
                            <Center>
                                {/* Label for SR only */}
                                <Spinner label="Loading chat rooms" color="white" size="xl"/>
                            </Center>
                        </Flex>}
                    {!isLoading &&
                        <GridItem colSpan={4}>
                            <Grid templateColumns='1fr' gap={6} px={4}>
                                {rooms.map((val) =>
                                    <Center key={val}>
                                        <Button key={val} as={Link} to={`/rooms/${val}`} colorScheme='teal'
                                                w={'50%'}>
                                            {val}
                                        </Button>
                                    </Center>
                                )}
                            </Grid>
                        </GridItem>

                    }
                </div>

                <div style={{flexGrow: 1}}>
                    <MemberList members={members}/>
                </div>

            </Flex>

        </div>
    )

}