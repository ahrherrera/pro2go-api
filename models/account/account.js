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

            request.execute("[dbo].[sp_Login]").then(function(recordsets) {
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
                    return resolve(data);
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

exports.registerContractor = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();
        sql.connect(conn).then(function() {
            var request = new sql.Request();
            request.input('Names', sql.VarChar(150), req.body.Names);
            request.input('Email', sql.VarChar(100), req.body.Email);
            request.input('phone', sql.VarChar(15), req.body.phone);
            request.input('Services', sql.NVarChar(sql.MAX), req.body.Services);
            request.input('TypeID', sql.Int, req.body.type);
            request.input('username', sql.VarChar(150), req.body.username);
            request.input('password', sql.VarChar(100), req.body.password);
            request.input('state', sql.VarChar(100), req.body.state);
            request.input('city', sql.VarChar(100), req.body.city);
            request.input('address', sql.VarChar(100), req.body.address);
            request.input('zip', sql.VarChar(20), req.body.zip);
            request.input('picUrl', sql.VarChar(300), req.body.profilePic);
            request.input('CertificateURL', sql.VarChar(300), req.body.certificateUrl);
            request.input('budget', sql.VarChar(100), req.body.budget);
            request.input('availability', sql.VarChar(100), req.body.availability);
            request.input('hire', sql.Bit, null);
            request.input('bid', sql.Bit, null);
            request.input('timeFrame', sql.VarChar(300), null);

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
                    jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
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

exports.registerCustomer = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();
        sql.connect(conn).then(function() {
            var request = new sql.Request();
            request.input('Names', sql.VarChar(150), req.body.Names);
            request.input('Email', sql.VarChar(100), req.body.Email);
            request.input('phone', sql.VarChar(15), req.body.phone);
            request.input('address', sql.VarChar(100), req.body.address);
            request.input('Services', sql.NVarChar(sql.MAX), null);
            request.input('TypeID', sql.Int, req.body.type);
            request.input('username', sql.VarChar(150), req.body.username);
            request.input('password', sql.VarChar(100), req.body.password);
            request.input('state', sql.VarChar(100), req.body.state);
            request.input('city', sql.VarChar(100), req.body.city);
            request.input('zip', sql.VarChar(20), req.body.zip);
            request.input('picUrl', sql.VarChar(300), null);
            request.input('CertificateURL', sql.VarChar(300), null);
            request.input('budget', sql.VarChar(100), null);
            request.input('availability', sql.VarChar(100), null);
            request.input('hire', sql.Bit, null);
            request.input('bid', sql.Bit, null);
            request.input('timeFrame', sql.VarChar(300), null);

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
                    jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
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

exports.upload = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        console.log(req);
        if (req.file) {
            console.log(req.file);
            return resolve({ response: req.file.destination + "/" + req.file.filename });
        } else {
            return reject({ response: "Error uploading" })
        }
    });
};

exports.sendLocation = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!

        var conn = config.findConfig();
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };
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
                        request.input('profileID', sql.Int, authData.User.Profile.id);
                        request.input('Latitude', sql.Decimal(9, 6), req.body.lat);
                        request.input('Longitude', sql.Decimal(9, 6), req.body.lng);

                        request.execute("[dbo].sp_updateLocation").then(function(recordsets) {
                            sql.close();
                            return resolve(data);
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

    });
};