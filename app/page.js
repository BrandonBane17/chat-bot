"use client"
import { Button, Stack, Box, TextField } from "@mui/material"
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
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      
    >
      <Stack 
        direction={"column"} 
        width="550px" 
        height="750px"
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
          
        >
          {
            messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? "flex-start" : "flex-end"}
              >
                <Box
                  bgcolor={message.role === 'assistant' ? "primary.main" : "secondary.main"}
                  fontSize={16}
                  color="white"
                  paddingRight={2}
                  paddingLeft={2}
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
        <Stack direction={"row"} spacing={2}>
          <TextField 
            label="Message" 
            fullWidth 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}
          sx={{
            border: '2px solid black', // Add border
            backgroundColor: '#4caf50', // Set background color
            color: 'white', // Set text color
          '&:hover': {
            backgroundColor: '#45a049', // Set background color on hover
            borderColor: '#0057e7', // Set border color on hover
            },
          }}
          >
            Send
          </Button>
          </Stack>
      </Stack>
    </Box>
  )
}
