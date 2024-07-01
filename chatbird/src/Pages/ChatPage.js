import React, { useState } from "react";
import { ChatState } from "../Context/ChatProviders";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import Chatbox from "../Components/Chatbox";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer></SideDrawer>}

      <Box
        display="flex"
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain}></MyChats>}
        {user && (
          <Chatbox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          ></Chatbox>
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
