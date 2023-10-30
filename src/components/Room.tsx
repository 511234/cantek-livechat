import {useParams} from "react-router-dom";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {FIREBASE_DB} from "../firebase.config";
import {Avatar, Box, HStack, Input, Skeleton, Stack, Tooltip} from "@chakra-ui/react";
import {UI_MAIN_COLOR, UI_TEXT_MAIN_COLOR} from "../constants";


export const Room = ({currentUser}: { currentUser: any }) => {
    const {name} = useParams()
    const [roomMessages, setRoomMessages] = useState<any[]>([])
    const messagesRef = collection(FIREBASE_DB, "messages");
    const [isLoading, setIsLoading] = useState(true)

    const handleSubmit = () => {

    }

    useEffect(() => {

        const queryMessages = query(
            messagesRef,
            where("room", "==", name)
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

    console.log('roomMessages', roomMessages)
    console.log('currentUser', currentUser)


    return (<>
        {name}
        <Stack m="4" spacing='12px'>
            {isLoading && Array(6).fill(5).map((v, i) =>
                <Skeleton height={`${80 - v * i}px`}/>
            )}

            {!isLoading &&
                <>
                    <Box sx={{border: "0.2rem solid #41DFC5"}} h='100%' w='100%'
                         p={4}
                         color='white'>

                        {roomMessages.map(msg => {
                                const isCurrentUser = currentUser?.uid === msg.uid
                                return (
                                    <HStack direction='row' gap={5}>
                                        <Tooltip label={msg.displayName} fontSize='md'>
                                            <Avatar name={msg.displayName}/>
                                        </Tooltip>
                                        <Box bgColor={isCurrentUser ? UI_MAIN_COLOR : 'white'}
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
                            <form onSubmit={handleSubmit}>
                                <Input
                                    autoFocus
                                    mx={4}
                                    placeholder='Enter your message'
                                    _placeholder={{opacity: 0.8, color: 'white'}}
                                    variant="unstyled"
                                /></form>
                        </Box>

                    </Box>
                </>
            }
        </Stack>
    </>)
}