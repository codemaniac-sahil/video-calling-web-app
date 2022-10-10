import React,{useContext} from 'react'
import Button from '@mui/material/Button'
import { SocketContext } from '../SocketContext'

const Notification = () => {
  const {answerCall,call,callAccepted}=useContext(SocketContext)
  return (
    <>
    {
      call.isRecievedCall && !callAccepted&&(
        <div >
          <h1>{call.name} is calling</h1>
          <Button variant='contained' color='primary' onClick={answerCall}>
            Answer

          </Button>
        </div>
      )
    }
    </>
  )
}

export default Notification