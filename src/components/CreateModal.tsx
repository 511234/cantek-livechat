import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {UI_TEXT_MAIN_COLOR} from "../constants";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {FIREBASE_DB} from "../firebase.config";
import {useRef} from "react";

interface ICreateModal {
    currentUser: any;
    initialRef: any
    isOpen: boolean;
    onClose: any
}

export const CreateModal = ({currentUser, initialRef, isOpen, onClose}: ICreateModal) => {

    const messagesRef = collection(FIREBASE_DB, "messages");
    const newRoomRef = useRef<HTMLInputElement>(null)
    const newMsgRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: any) => {
        console.log('hi are we here')
        e.preventDefault()

        console.log('newRoomRef', newRoomRef)
        console.log('newMsgRef', newMsgRef)

        try {
            if (!newRoomRef?.current?.value || !newMsgRef?.current?.value) {
                console.log('?_?')
                return
            }

            await addDoc(messagesRef, {
                text: newMsgRef.current.value,
                createdAt: serverTimestamp(),
                displayName: currentUser.displayName,
                uid: currentUser.uid,
                room: newRoomRef.current.value,
            });

            newRoomRef.current.value = ''
            newMsgRef.current.value = ''
            onClose()
        } catch (e) {
            console.log('e', e)
        }
    }

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay bg='blackAlpha.300'
                              backdropFilter='blur(10px) hue-rotate(45deg)'/>
                <ModalContent bg="black" color={UI_TEXT_MAIN_COLOR}>
                    <ModalHeader>Create a Room!</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Room Name</FormLabel>
                            <Input
                                borderColor={UI_TEXT_MAIN_COLOR}
                                placeholder='Room name'
                                ref={newRoomRef}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Your message</FormLabel>
                            <Input borderColor={UI_TEXT_MAIN_COLOR}
                                   placeholder='Tell us how excited you are about the topic!'
                                   ref={newMsgRef}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='teal' onClick={handleSubmit} mr={3} variant="solid">
                            Create
                        </Button>
                        <Button colorScheme="blackAlpha" variant="solid" onClick={onClose}>Maybe next time</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}