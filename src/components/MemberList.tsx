import {Badge, Box, StackDivider, VStack} from "@chakra-ui/react";
import {UI_MAIN_COLOR} from "../constants";

interface IMemberList {
    members: any
}

export const MemberList = ({members}: IMemberList) => {
    return (
        <div>
            <VStack
                borderLeftColor={UI_MAIN_COLOR}
                borderLeftStyle='solid'
                borderLeftWidth='0.05rem'
                color="white"
                divider={<StackDivider borderColor={UI_MAIN_COLOR}/>}
                h='100%'
                w='100%'
                pt={3}
            >
                <Badge colorScheme='teal' py={2}>Members</Badge>
                {members.map((member: any) => <Box key={member.uid}>{member.displayName}</Box>)}
            </VStack>

        </div>
    )
}