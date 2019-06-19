var express = require("express")
var bobyParser = require("body-parser")

var app = express()
app.use(express.static(__dirname))
app.use(bobyParser.json())
app.use(bobyParser.urlencoded({extended:false}))

var messages = [
    {
        name : "Shiva",
        message : "Immortals of meluha"
    },
    {
        name : "Vishnu",
        message : "Immortals of Devagiri"
    }
]

app.get("/messages",(req, res) => {
    res.send(messages)
})

app.post("/message", (req, res)=>{
    console.log(req.body)
    messages.push(req.body)
    res.sendStatus(200)
})

var server = app.listen(3000, () => {
    console.log("Server is listening on port :: " + server.address().port)
});