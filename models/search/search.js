var config = require("../../controllers/mssql/mssqlconnector"),
    sql = require('mssql'),
    jwt = require('jsonwebtoken');

exports.search = function(req) {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };
        var conn = config.findConfig();

        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(req.token, 'Y2Ae7kXZ', (err, authData) => {
                if (err) {
                    data.msg.Code = 400;
                    data.msg.Message = "Unauthorized";
                    return reject(data);
                } else {
                    sql.connect(conn).then(function() {
                        var request = new sql.Request();
                        request.input('ProfileID', sql.Int, authData.User.Profile.id);
                        request.input('Service', sql.Int, req.body.service);
                        request.input('Type', sql.Int, req.body.type);

                        request.execute("[dbo].sp_Search").then(function(recordsets) {

                            console.log(recordsets);
                            let rows = recordsets.recordset;
                            return resolve(rows);
                        }).catch(function(err) {
                            data.msg.Code = 500;
                            //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                            data.msg.Message = err.message;

                            sql.close();
                            return reject(data);
                        });
                    }).catch(function(err) {
                        data.msg.Code = 500;
                        data.msg.Message = err.message;
                        sql.close();
                        return reject(data);
                    });
                }
            });
        } else {
            // Unauthorized
            data.msg.Code = 400;
            data.msg.Message = "Unauthorized";
            return reject(data);
        }
    })

}