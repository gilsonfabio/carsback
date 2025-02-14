const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv/config');

module.exports = {       
    
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;

        console.log('Email:', email);
        console.log('Password:', senha);

        const usuario = await connection('users')
            .where('usrEmail', email) 
            .select(`usrId`, `usrNome`, `usrEmail`, `usrAvatar`, `usrToken`)
            .first();
        
        if (!usuario) {            
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        //console.log(user.usrPassword)
        //let pass = usuario.usrPassword;
        //const match = await bcrypt.compare(senha, pass)

        //if(!match) {
        //    return response.status(403).send({ auth: false, message: 'User invalid!' });
        //}

        const user = {
            id: usuario.usrId,
            name: usuario.usrNome,
            email: usuario.usrEmail,
            avatar: usuario.usrAvatar,
            token: usuario.usrToken,
        }

        //let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
        //    expiresIn: '1h'
        //});
        //let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
        //    expiresIn: '2h'
        //});
        
        console.log('User data:', user);
        
        return response.json(user);

    },

    async newuser(request, response) {
        console.log(request.body);
        const {nome, cpf, nascimento, email, celular, password, avatar, token} = request.body;
        let status = 'A'; 
        let snhCrypt = await bcrypt.hash(password, saltRounds);
        const [usrId] = await connection('users').insert({
            usrNome: nome, 
            usrEmail: email, 
            usrCpf: cpf, 
            usrCelular: celular, 
            usrNascimento: nascimento, 
            usrPassword: snhCrypt, 
            usrToken: token,
            usrAvatar: avatar,
            usrStatus: status  
        });
           
        return response.json({usrId});
    },

    async atuToken(request, response) {        
        let idUser = request.body.usrId;
        let token = request.body.usrToken;

        console.log('usuarios:', request.body.usrId);
        console.log('token:', request.body.usrToken);

        const updUser = await connection('users')
        .where('usrId', idUser)
        .update({
            usrToken: token, 
        });
           
        return response.status(200).send();
      
    },
    
};
