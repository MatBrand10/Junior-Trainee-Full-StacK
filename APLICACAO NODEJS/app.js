const express = require("express");
    
const PORT = 3000;
const app = express();

app.get('/',(req, res) => {
    res.send('<h1>Olá mundo</h1>');
})
app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:${PORT}')
})

