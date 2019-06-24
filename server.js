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

app.post("/message", async (req, res) => {
    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()
        console.log("Message saved in db")
        var censored = await Message.findOne({
            message: 'badword'
        })
        if (censored) {
            await Message.deleteOne({
                _id: censored.id
            })
        } else {
            io.emit('message', req.body)
        }
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    } finally {
        console.log("process completed")
    }
})

io.on("connection", (socket) => {
    console.log("A user connected")
})

var server = http.listen(3000, () => {
    console.log("Server is listening on port :: " + server.address().port)
});