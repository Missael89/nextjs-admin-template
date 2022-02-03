const connection = require('../database/db');

exports.crud = async (req, res) => {
    try {
        const { id, code, language, query } = req.body
        let sql;
        let obj;

        switch (query) {
            case 'insert':
                sql = 'INSERT INTO LOCALE(CODE, LANGUAGE) VALUES(?,?)';
                obj = [code, language];
                break;
            case 'update':
                sql = 'INSERT INTO LOCALE(CODE, LANGUAGE) VALUES(?,?)';
                obj = [code, language];
                break;
            case 'select':
                sql = 'SELECT * FROM LOCALE';
                break;
        }

        connection.query(sql, obj, (err, result) => {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    error_msg: `Error al registrar Lenguaje`,
                    err
                });
            } else {
                res.send({
                    success: true,
                    message: 'Success',
                    result
                });
            }

        });
    } catch (error) {
        console.log(error)
    }
}