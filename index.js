const fs = require("fs")
const http = require("http")
const os = require("os")
const {Transform} = require("stream")

// fs.writeFileSync("example.txt","hello world")
// console.log("file is created successfully")

// const data = fs.readFileSync("example.txt","utf-8")
// console.log(data)

// fs.appendFileSync("example.txt","\n another line append")
// console.log("data append synchronously")

// if(fs.existsSync("example.txt")){
//     fs.unlinkSync("example.txt")
//     console.log("file is deleted successfully")
// }else{
//     console.log("file does not exist")
// }

// const server = http.createServer((req,res)=>{
//     res.end("hello world")
// })

// server.listen(3000,()=>{
//     console.log("server is running at port number 3000")
// })

// console.log(os.platform())
// console.log(os.type())
// console.log(os.release())
// console.log(os.arch())
// console.log(os.cpus())
// console.log(os.totalmem())
// console.log(os.freemem())
// console.log(os.uptime())
// console.log(os.hostname())
// console.log(os.userInfo())

const read = fs.createReadStream("input.txt","utf-8")
read.on('data',(chunk)=>{
console.log("chunk of data is fetch",chunk)
})

read.on('end',()=>{
    console.log("all data is get here")
})
read.on('error',(err)=>{
    console.log("error is occured",err)
}
)

const write = fs.createWriteStream("output.txt")
// read.pipe(write)

// write.on('finish',()=>{
//     console.log("all data is write inside the output file")
// })
// write.on('error',()=>{
//     console.log(err)
// }
// )  

const upperCaseStream = new Transform({
    transform(chunk,encoding,callback){
        const upperCase = chunk.toString().toUpperCase();
        callback(null,upperCase)
    }
})
read.pipe(upperCaseStream).pipe(write)

write.on('finish',()=>{
    console.log("tranformation completed")
})
write.on('error',()=>{
    console.log("show error",err)
})