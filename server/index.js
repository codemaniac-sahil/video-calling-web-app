const express = require ('express')
let app=express()
const server=require('http').createServer(app)
const cors = require('cors')

const io =require('socket.io')(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})
app.use(cors())
const port=5000
app.get('/',(req,res,next)=>{
    res.send("server is running")
    next()
})
app.use(express.static('./model'))
server.listen(port,()=>{
    console.log("server is running at port"+port)
})

