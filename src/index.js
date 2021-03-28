
import express from 'express'





const app = express()
const port = 3000

app.get ("/", (req, res) => { 
    res.send("Hello world")
    console.log("hello world")
})

app.listen(port, () => console.log(`Slusam na portu ${port}!`))