const { Console } = require('console');
const connection = require('../database/connection');
const moment = require('moment/moment');

module.exports = {   
    async index (request, response) {
        const motoristas = await connection('motoristas')
        .orderBy('motId')
        .select('*');
    
        return response.json(motoristas);
    }, 
    
    async searchDriver (request, response) {
        const motoristas = await connection('motoristas')
        .orderBy('motId')
        .select('*');
    
        return response.json(motoristas);
    }, 

    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;

        console.log('Email:', email);
        console.log('Password:', senha);

        const motorista = await connection('motoristas')
            .where('motEmail', email) 
            .select(`motId`, `motNome`, `motEmail`, `motAvatar`, `motToken`, `motFireToken`)
            .first();
        
        if (!motorista) {            
            return response.status(400).json({ error: 'Não encontrou motorista com este ID'});
        } 

        //console.log(user.usrPassword)
        //let pass = usuario.usrPassword;
        //const match = await bcrypt.compare(senha, pass)

        //if(!match) {
        //    return response.status(403).send({ auth: false, message: 'User invalid!' });
        //}

        const usrMot = {
            id: motorista.motId,
            name: motorista.motNome,
            email: motorista.motEmail,
            avatar: motorista.motAvatar,
            token: motorista.motoken,
            firebaseToken: motorista.motFireToken,
        }

        //let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
        //    expiresIn: '1h'
        //});
        //let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
        //    expiresIn: '2h'
        //});
        
        console.log('User data:', usrMot);
        
        return response.json(usrMot);

    },
        
    async create(request, response) {
        const {motNome, motNascimento, motCpf, motHabilitacao, motCelular, motEmail, motPassword, motToken} = request.body;
        
        /*
        let datAtual = new Date();
        let year = datAtual.getFullYear();
        let month = datAtual.getMonth();
        let day = datAtual.getDate();
         
        let datProcess = new Date(year,month,day);
        let horProcess = moment().format('hh:mm:ss');
        */
        
        let status = "A";
        
        const [motId] = await connection('motoristas').insert({
            motNome, 
            motNascimento,
            motCpf, 
            motHabilitacao,
            motCelular, 
            motEmail, 
            motPassword, 
            motToken, 
            motAvaliacao,
            motStatus: status     
        });
         
        return response.json({motId});
    },    

    async atuToken(request, response) {        
        let idMot = request.body.motId;
        let token = request.body.motToken;
        let fireToken = request.body.motFireToken;

        console.log('motorista:', request.body.usrId);
        console.log('token:', request.body.usrToken);

        const updMotor = await connection('motoristas')
        .where('motId', idMot)
        .update({
            motToken: token, 
            motFireToken: fireToken,
        });
           
        return response.status(200).send();
      
    },
};
