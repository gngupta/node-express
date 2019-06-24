var express = require("express")
var bobyParser = require("body-parser")
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)

var mongoose = require("mongoose")
var dbURL = "mongodb+srv://user:Passw0rd1@meanstack-2fupe.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(dbURL, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log("Mongo db connection error :: " + err)
    } else {
        console.log("Mongo db connection successful")
    }
})

app.use(express.static(__dirname))
app.use(bobyParser.json())
app.use(bobyParser.urlencoded({
    extended: false
}))

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get("/messages", (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) {
            console.log("Error occured while finding messages from mongo db")
        } else {
            res.send(messages)
        }
    })
})

app.post("/message", (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if (err) {
            console.log("Failed to save in mongo db")
            res.sendStatus(500)
        } else {
            io.emit('message', req.body)
            res.sendStatus(200)
        }
    })
})

io.on("connection", (socket) => {
    console.log("A user connected")
})

var server = http.listen(3000, () => {
    console.log("Server is listening on port :: " + server.address().port)
});