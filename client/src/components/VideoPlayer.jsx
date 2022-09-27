import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { SocketContext } from '../SocketContext'
import { useContext } from 'react'

const VideoPlayer = () => {
  const {name,callAccepted,myVideo,userVideo,callEnded,stream,call}=useContext(SocketContext)
  return (
    
    <Grid className='videoplayer'>
      {/* My Video */}

      {
        stream &&(
      <Paper className='paper1'>
        <Grid className='grid1'>
          <Typography variant='h5' gutterBottom>{name||'Name'}</Typography>
          <video playsInline muted ref={myVideo} autoPlay />

        </Grid>

      </Paper>

        )
      }
      {/* user video */}

      {
        callAccepted && !callEnded &&(

      <Paper className='paper1'>
        <Grid >
          <Typography variant='h5' gutterBottom>{call.name||'Name'}</Typography>
          <video playsInline ref={userVideo}  autoPlay/>
          
        </Grid>

      </Paper>
        )
      }

    </Grid>
   
  )
}

export default VideoPlayer