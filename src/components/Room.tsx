import {Link, useParams} from "react-router-dom";
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where} from "firebase/firestore";
import React, {useEffect, useRef, useState} from "react";
import {FIREBASE_DB} from "../firebase.config";
import {Avatar, Box, Flex, Heading, HStack, Input, Skeleton, Stack, Tooltip} from "@chakra-ui/react";
import {UI_MAIN_COLOR, UI_TEXT_MAIN_COLOR} from "../constants";
import {ArrowBackIcon} from "@chakra-ui/icons";

interface IRoomProps {
    currentUser: any
    isAuth: boolean
}

export const Room = ({currentUser, isAuth}: IRoomProps) => {
    const {room} = useParams()
    const [roomMessages, setRoomMessages] = useState<any[]>([])
    const messagesRef = collection(FIREBASE_DB, "messages");
    const [isLoading, setIsLoading] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null)


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {

            if (!inputRef?.current?.value) {
                return
            }

            await addDoc(messagesRef, {
                text: inputRef.current.value,
                createdAt: serverTimestamp(),
                displayName: currentUser.displayName,
                uid: currentUser.uid,
                room,
            });

            inputRef.current.value = ''

        } catch (e) {
            console.log('e', e)
        }
    }

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where("room", "==", room)
            , orderBy("createdAt")
        );

        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let msgs: any[] = [];
            snapshot.forEach((doc) => {
                msgs.push({...doc.data(), id: doc.id});
            });
            setRoomMessages(msgs);
            setIsLoading(false)
        });

        return () => unsuscribe();
    }, [])

    return (<>
        <Link to={'/'}>
            <Flex direction="row" align="center" my={3} px={4} gap={3}>
                <ArrowBackIcon color={'white'} w="6" h="6"/>
                <Heading color={UI_MAIN_COLOR} as='h2' size='lg'>{room}</Heading>
            </Flex>
        </Link>

        <Stack m="4" spacing='12px'>
            {isLoading && Array(6).fill(5).map((v, i) =>
                <Skeleton key={i} height={`${80 - v * i}px`}/>
            )}

            {!isLoading &&
                <>
                    <Box sx={{border: "0.2rem solid #41DFC5"}} h='100%' w='100%'
                         p={4}
                         color='white'>

                        {roomMessages.map(msg => {
                                const isCurrentUser = currentUser?.uid === msg.uid
                                return (
                                    <HStack key={msg.text} justify={isCurrentUser ? 'end' : 'start'} direction='row'
                                            gap={5}>
                                        <Tooltip label={msg.displayName} fontSize='md'>
                                            <Avatar name={msg.displayName}/>
                                        </Tooltip>
                                        <Box bgColor={isCurrentUser ? UI_TEXT_MAIN_COLOR : 'white'}
                                             borderRadius="lg"
                                             fontWeight="semibold"
                                             h='100%' w='30%'
                                             p={4}
                                             color={isCurrentUser ? 'white' : UI_TEXT_MAIN_COLOR}>
                                            {msg.text}
                                        </Box>
                                    </HStack>
                                )
                            }
                        )
                        }
                        <Box bgColor={UI_TEXT_MAIN_COLOR}
                             borderRadius="lg"
                             color='white'
                             h='100%'
                             py={4}
                             mt={4}
                             w='100%'
                        >
                            {isAuth &&
                                <form onSubmit={handleSubmit}>
                                    <Input
                                        autoFocus
                                        mx={4}
                                        placeholder='Enter your message'
                                        _placeholder={{opacity: 0.8, color: 'white'}}
                                        ref={inputRef}
                                        variant="unstyled"
                                    /></form>
                            }
                            {!isAuth &&
                                <span>Please Login</span>
                            }
                        </Box>

                    </Box>
                </>
            }
        </Stack>
    </>)
}