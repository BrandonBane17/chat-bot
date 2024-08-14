"use client"
import { Button, Stack, Box, TextField, Typography } from "@mui/material"
import { useState } from "react"


// hello test world hello world 

export default function Home() {
  const [messages, setMessages] = useState([
    {role: 'assistant', content: 'Hello! I am the basketball stats chatbot. How can I help you today?'},
  ])
  const [message, setMessage] = useState('')
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, {role: 'user', content: message}, {role: 'assistant', content: ''}])
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
      }).then(async (res) => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        return reader.read().then(function processText({ done, value }) {
          if (done) {
            return result
          }
          const text = decoder.decode(value || new Uint8Array(), { stream: true });
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1]
            let otherMessages = messages.slice(0, messages.length - 1)

            return [...otherMessages, {...lastMessage, content: lastMessage.content + text}];
          })
          return reader.read().then(processText)
        })
      })
    }

  // return function   
  return (
    <Box
      sx={{
        //backgroundImage: 'url("https://www.nba.com/resources/static/team/v2/nets/images/hero.jpg")',
        //backgroundImage: 'url("basketball_falling,mp4")',
        //backgroundImage: 'url("istockphoto-472)', 
        backgroundColor: 'black',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        //width="100vw"
        //height="100vh"
        borderRadius={4}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
      >
        <Stack 
         direction={"column"} 
          width="600px" 
          height="800px"
          border="2px solid black" 
          boxShadow={4}
          p={2}
          borderRadius={4}
        
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow={"auto"}
            maxHeight={"100%"}
            p = {2}
          >
            {
              messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={message.role === 'assistant' ? "flex-start" : "flex-end"}
                >
                  <Box
                    bgcolor={message.role === 'assistant' ? "black" : "#484848"} // text box color 
                    fontSize={16}
                    color="white"
                    paddingRight={1.5}
                    paddingLeft={1.5}
                    paddingTop={1.5}
                    paddingBottom={1.5}
                    borderRadius={3}
                    boxShadow={2}
                    //p={2}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
          </Stack>
          <Stack direction={"row"} spacing={2} borderRadius={10}>
            <TextField 
              label="Message" 
              fullWidth 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}
            sx={{
              border: '2px solid black', // Add border
              backgroundColor: 'black', // Set background color
              color: 'white', // Set text color
              borderRadius: '12px', // Set border radius
            '&:hover': {
              backgroundColor: 'black', // Set background color on hover
              borderColor: 'white', // Set border color on hover
              borderWidth: '3px', // Set border width on hover
              },
            }}
          >
                Send
              </Button>
            </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
