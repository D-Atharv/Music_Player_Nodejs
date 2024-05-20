const express = require('express');
const app = express();

const PORT = 3000;

app.post("/", (req, resp) => {
    res.send("Hello")
})

app.get("/users", (req, resp) => {
    resp.send();
})
app.listen(PORT, () => {
    console.log('Server is running')
})