const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const EmailValidator = require('email-deep-validator');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/validate/', async (req, res) => {
    const dados = req.body;
    const emailValidator = new EmailValidator();
    const jwt = require('jsonwebtoken');
    var validtoken;

	await jwt.verify(req.headers["auth-key"], process.env.SECRET, function(err, decoded) {
		if (!err) {
			validtoken = true;
		}    
	});

    if(!validtoken){
		res.send({
			status: -1,
			error: "Invalid token"
		});
	}else{
        const valid = await emailValidator.verify(dados.email);
        // const used = process.memoryUsage().heapUsed / 1024 / 1024;
        // valid.memory = used;
        res.send(valid);
    }
});

app.get('/auth/', async (req, res) => {
    if (process.env.USER == req.headers["username"] && process.env.PASS == req.headers["password"]){
        var jwt = require('jsonwebtoken');
        const id = process.env.USER + process.env.PASS;
        var token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: process.env.EXPIRES
        });
        res.send({authtoken: token})
    } else {
        res.send({error: 'Usuário ou senha inválidos.'});
    }
});

app.listen(port, () => {
    console.log(`aplicação rodando na porta ${port}`)
});