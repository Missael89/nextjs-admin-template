const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const connection = require('../database/db');
const { promisify } = require('util');

//Registro de Usuarios
exports.register = async (req, res) => {

    try {
        const { firstName, lastName, email, password, query } = req.body;
        const fullName = `${firstName} ${lastName}`;
        let passwordHash = await bcryptjs.hash(password, 8);
        //console.log(passwordHash);

        connection.query(`CALL user_insert('${email}', '${fullName}', '${passwordHash}')`, (error, results) => {
            if (error) {
                console.log(error);
            }
            res.json({
                success: true,
                message: 'Usuario Registrado'
            });
        });
    } catch (error) {
        console.log(error);
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password, query } = req.body;
        
        connection.query(`CALL user_login('${email}')`, async (error, results) => {
            
            let passCompare = await bcryptjs.compare(password, results[0][0].PASSWORD);

            if (results.length == 0 || !(passCompare)) {
                res.send({
                    success: false,
                    message: 'Usuario y/o contraseña incorrecta.',
                    error: null
                });
            } else {
                const id = results[0][0].ID;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXP_TIME
                });

                console.log(`TOKEN: ${token} para el Usuario: ${email}`);

                const cookiesOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookiesOptions);
                req.session.user = results[0];
                
                res.send({
                    success: true,
                    user: results[0]
                });
            }

        });
    } catch (error) {
        console.log(error);
    }
}

exports.isAuthenticated2 = async (req, res) => {
    if(req.session.user) {
        res.send({
            loggedIn: true, 
            user: req.session.user
        })
    } else {
        res.send({
            loggedIn: false
        })
    }
}

/*exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodif = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            connection.query('SELECT * FROM USERS WHERE ID = ?', [decodif.id], (error, results) => {
                if (!results) {
                    return next();
                }

                req.user = results[0][0]
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('http://localhost:3000/auth/login');
    }
}*/

exports.logout = (req,res) => {
    res.clearCookie('jwt');
    return re.redirect('http://localhost:3000/');
}