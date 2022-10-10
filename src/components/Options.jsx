import React, { useContext } from 'react'
import {Button,TextField,Grid,Typography,Container,Paper} from '@mui/material'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Assignment,Phone,PhoneDisabled} from '@mui/icons-material'
import { SocketContext } from '../SocketContext'
import { useState } from 'react'
const Options = ({children}) => {
  const {me,callAccepted,name,setName,callEnded,leaveCall,callUser}=useContext(SocketContext)
  const [idToCall, setIdToCall] = useState('')
  return (
    <Container >
      <Paper className='lms'>
        <form  noValidate autoComplete='off'>
          <Grid className='form'>
            <Grid >
              <Typography gutterBottom variant="h6">Account Info</Typography>
              <TextField label='Name' value={name} onChange={(e)=>setName(e.target.value)} fullWidth/>
              
              <CopyToClipboard text={me}>
                <Button sx={{marginTop:'1em'}} variant='contained' color='primary' startIcon={<Assignment fontSize='large'/>}>
                  Copy Your Id
                </Button>

              </CopyToClipboard>

            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h6">Make a Call</Typography>
              <TextField label='ID to call' value={idToCall} onChange={(e)=>setIdToCall(e.target.value)} fullWidth/>
             {
              callAccepted && !callEnded ? (
                <Button sx={{marginTop:'1em'}} variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize='large'/>}
                onClick={leaveCall}>

                  Hang Up
                </Button>

              ):(
                <Button sx={{marginTop:'1em'}} variant="contained" color="primary" startIcon={<Phone fontSize='large'/>}
                onClick={()=>callUser(idToCall)}>
                  Call
                </Button>

              )
             }

            </Grid>
          </Grid>
        </form>
      {children}
      </Paper>
    </Container>
  )
}

export default Options