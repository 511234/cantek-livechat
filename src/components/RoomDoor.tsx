import {Card, CardHeader, Heading} from '@chakra-ui/react'

export const RoomDoor = ({text}: { text: string }) => {
    return (<>
        <Card mx={36}>
            <CardHeader>
                <Heading size='md'>{text}</Heading>
            </CardHeader>
        </Card>
    </>)
}