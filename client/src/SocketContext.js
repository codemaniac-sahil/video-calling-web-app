import React, { createContext,useEffect,useState,useRef } from "react";
import {io} from 'socket.io-client'
import Peer from 'simple-peer'



const SocketContext=createContext()


const socket=io('http://localhost:5000')


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
export {ContextProvider,SocketContext}