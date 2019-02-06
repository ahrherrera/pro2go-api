var config = require("../../controllers/mssql/mssqlconnector"),
    sql = require('mssql'),
    jwt = require('jsonwebtoken');

//Module export returning a promise

exports.testConnection = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!

        var conn = config.findConfig();

        sql.connect(conn).then(function() {
            console.log(req);
            sql.close();
            return resolve('Connection successful');

        }).catch(function(err) {
            sql.close();
            return reject(err);
        })
    });
};

exports.login = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();

        sql.connect(conn).then(function() {
            var request = new sql.Request();
            request.input('Username', sql.VarChar(50), req.body.Username);
            request.input('Password', sql.VarChar(100), req.body.Password);

            req.execute("[dbo].[sp_Login]").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }
                if (mainKey.Status == 0) {
                    sql.close();
                    data.msg.Code = 400;
                    data.msg.Message = mainKey.Mensaje;
                    return reject(data);
                } else {
                    sql.close();
                    jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                        data = {
                            token: token
                        };
                        return resolve(data);
                    });

                }
            }).catch(function(err) {
                data.msg.Code = 500;
                data.msg.Message = err.message;
                sql.close();
                return reject(err);

            });

        }).catch(function(err) {
            sql.close();
            return reject(err);
        });
    });
};

exports.register = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();

        sql.connect(conn).then(function() {
            var request = new sql.Request();
            request.input('FirstName', sql.VarChar(150), req.body.FirstName);
            request.input('LastName', sql.VarChar(150), req.body.LastName);
            request.input('Email', sql.VarChar(100), req.body.Email);
            request.input('phone', sql.VarChar(15), req.body.phone);
            request.input('ServiceID', sql.Int, req.body.serviceID);
            request.input('TypeID', sql.Int, req.body.TypeID);
            request.input('birthday', sql.Date, req.body.birthday);
            request.input('username', sql.VarChar(150), req.body.username);
            request.input('password', sql.VarChar(100), req.body.password);
            request.input('state', sql.VarChar(100), req.body.state);
            request.input('city', sql.VarChar(100), req.body.city);

            request.execute("[dbo].sp_CreateUser").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }
                if (mainKey.message == "Username already exists") {
                    data.msg.Code = 400;
                    data.msg.Message = mainKey.message;
                    sql.close();
                    return reject(err);
                } else {
                    jwt.sign(JSON.parse(mainKey[selectedKey]), 'cKWM5oINGy', (err, token) => {
                        data = {
                            token: token
                        };
                        return resolve(data);
                    });
                    sql.close();
                }
            }).catch(function(err) {
                data.msg.Code = 500;
                //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                data.msg.Message = err.message;
                sql.close();
                return reject(err);
            });
        }).catch(function(err) {
            data.msg.Code = 500;
            data.msg.Message = err.message;
            sql.close();
            return reject(err);
        });
    });
};