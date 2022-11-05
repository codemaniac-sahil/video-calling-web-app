import React, { createContext, useEffect, useState, useRef } from "react";
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import * as tf from '@tensorflow/tfjs'
// import {loadGraphModel} from '@tensorflow/tfjs-converter';
// const model_url='model.json'
// const model = await loadGraphModel(model_url);
// import modelWeight1 from "..server/model.json"

const SocketContext = createContext()
const socket = io('https://video-calling-app-react.herokuapp.com');


const ContextProvider=({children})=>{
    const [stream, setStream] = useState(null)
    const [me, setMe] = useState('')
    const [call, setCall] = useState({})
    const [callEnded, setCallEnded] = useState(false)
    const [callAccepted, setCallAccepted] = useState(false)
    const [name, setName] = useState('')
    const myVideo=useRef()
    const userVideo=useRef()
    const connectionRef=useRef()




    const detect = async (net) => {
        // Check data is available
       
    
          // 4. TODO - Make Detections
          const img=tf.browser.fromPixels(myVideo)
          const resized=tf.image.resizeBilinear(img,[640,480])
          const casted=resized.cast('int32')
          const expanded=casted.expandDims(0)
          const obj=await net.executeAsync(expanded)
          console.log(obj)
    
    
    
          // Draw mesh
        //   const ctx = canvasRef.current.getContext("2d");
    
          // 5. TODO - Update drawing utility
          // drawSomething(obj, ctx)  
    
          tf.dispose(img)
          tf.dispose(resized)
          tf.dispose(casted)
          tf.dispose(expanded)
          tf.dispose(obj)
        }
    
        const runCoco=async ()=>{
            const net= await tf.loadGraphModel('http://localhost:5000/model.json')
            
        
        
            setInterval(()=>{
                detect(net);
        
            },16.7)
        }
  useEffect(()=>{runCoco()},[]);
    

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:true})
        .then((currenStream)=>{
            setStream(currenStream)
            myVideo.current.srcObject=currenStream;


        })
        
        
        socket.on('me',(id)=>{
            setMe(id)
        })
        
        
        socket.on('calluser',({from,name:callerName,signal})=>{
            setCall({isRecievedCall:true,from,name:callerName,signal})

        })
    },[])



    const answerCall=()=>{
        setCallAccepted(true)
        const peer=new Peer({initiator:false,trickle:false,stream})
        peer.on('signal',(data)=>{
            socket.emit('answercall',{signal:data,to:call.from});
        })
        peer.on('stream',(currenStream)=>{
            userVideo.current.srcObject=currenStream


        })
       
       
        peer.signal(call.signal)
        connectionRef.current=peer
    }
    
    
    
    const callUser=(id)=>{
        const peer=new Peer({initiator:true,trickle:false,stream})


        peer.on('signal',(data)=>{
            socket.emit('calluser',{userToCall:id,signalData:data,from:me,name});
        })
        peer.on('stream',(currenStream)=>{
            userVideo.current.srcObject=currenStream


        })
        socket.on('callaccepted',(signal)=>{
            setCallAccepted(true)
            peer.signal(signal)
        })
        connectionRef.current=peer

    }
    
    
    
    const leaveCall=()=>{
        setCallEnded(true)
        connectionRef.current.destroy()
        window.location.reload();

    }
    return(
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    )

}
export { ContextProvider, SocketContext }
