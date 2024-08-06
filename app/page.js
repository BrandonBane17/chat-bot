"use client"
import { Button, Stack, Box, TextField } from "@mui/material"
import { useState } from "react"

export default function Home() {
  const [messages, setMessages] = useState([
    {role: 'assistant', content: 'Hello! I am the basketball stats chatbot. How can I help you today?'},
  ])
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, {role: 'user', content: message}])
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
      })
      const data = await response.json()
      setMessages((messages) => [...messages, {role: 'assistant', content: data.message}])
    }
  const [message, setMessage] = useState('')
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
        width="500px" 
        height="700px"
        border="1px solid black" 
        p={2}
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
                  color="white"
                  p={3.5}
                  borderRadius={16}
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
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
          </Stack>
      </Stack>
    </Box>
  )
}
