import {  useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ChakraProvider,
  theme,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Container,
  Box
} from '@chakra-ui/react'


import Hero from './components/Hero'

export const notifyUser = async (notificationText = "Thank you for enabling notifications!") => {
  if(!("Notification" in window)) {
    alert("Browser does not support notifications")
  } else if(Notification.permission === "granted") {
    const notification = new Notification(notificationText)
  } else if(Notification.permission !== "denied") {
    await Notification.requestPermission().then((permission) => {
      if(permission === "granted") {
        const notification = new Notification(notificationText)
      }
    })
  }
}

const App = () => {
  const [userResponded, setUserResponded] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if(sessionStorage.getItem('userEmail') === null){
      navigate('/')
    }
  }, [])
  
  const enableNotifsAndClose = async () => {
    await notifyUser().then(() =>{
      setUserResponded(true)
    })
  }
  const disableNotifsAndClose = () => {
    setUserResponded(true)
  }
  return (
    <>
    {(!(userResponded) && !(Notification.permission === "granted")) ? (
      <ChakraProvider theme={theme}>
        <Hero/>
        <Container>
          <Alert status="success">
            <AlertIcon />
            <Box>
              <AlertTitle>Notifications</AlertTitle>
              <AlertDescription>
                Would you like to enable notifications?
              </AlertDescription>
            </Box>
            <Button colorScheme='teal' size='sm' onClick={enableNotifsAndClose} >
              Sure!
            </Button>
            <Button colorScheme='gray' size='sm' onClick={disableNotifsAndClose}>
              No thanks!
            </Button>
          </Alert>
        </Container>
      </ChakraProvider>
    ) : (Notification.permission === "granted") ? (
      <ChakraProvider theme={theme}>
        <Hero/>
      </ChakraProvider>
    ) : <Hero/>}
    
    </>    
  )
}

export default App