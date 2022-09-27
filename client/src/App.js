import React from 'react'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography';
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notification from './components/Notification';
import './styles.css'


const App = () => {
  return (
    <div className='app'> 
        <AppBar position="static" color="inherit"  >
            <Typography variant='h2' align='center'>Video Calling App</Typography>


        </AppBar>
        <VideoPlayer/>
        <Options>
            <Notification/>
        </Options>
    </div>
  )
}

export default App