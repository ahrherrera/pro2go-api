var config = require("../../controllers/mssql/mssqlconnector"),
    sql = require('mssql'),
    jwt = require('jsonwebtoken');

exports.search = function(req) {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };
        var conn = config.findConfig();

        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('ProfileID', sql.Int, req.body.profile);
            request.input('Service', sql.Int, req.body.service);
            request.input('Type', sql.Int, req.body.type);
            request.input('Description', sql.VarChar(500), req.body.description);
            request.input('zip', sql.VarChar(10), req.body.zip);

            request.execute("[dbo].sp_Search").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }
                conn.close();
                return resolve(mainKey[selectedKey]);
            }).catch(function(err) {
                data.msg.Code = 500;
                //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                data.msg.Message = err.message;

                conn.close();
                return reject(data);
            });
        }).catch(function(err) {
            data.msg.Code = 500;
            data.msg.Message = err.message;
            conn.close();
            return reject(data);
        });

    });

}

exports.update = function(req) {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };
        var conn = config.findConfig();

        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('ProfileID', sql.Int, req.body.profile);
            request.input('SearchID', sql.Int, req.body.search);
            request.input('type', sql.Int, req.body.type);

            request.execute("dbo.spUpdateSearch").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }
                conn.close();
                return resolve(mainKey[selectedKey]);
            }).catch(function(err) {
                data.msg.Code = 500;
                //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                data.msg.Message = err.message;

                conn.close();
                return reject(data);
            });
        }).catch(function(err) {
            data.msg.Code = 500;
            data.msg.Message = err.message;
            conn.close();
            return reject(data);
        });

    });

}

exports.getContractorProfile = function(req) {
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
                    conn.connect().then(function() {
                        var request = new sql.Request(conn);
                        request.input('ProfileID', sql.Int, req.body.ProfileID);

                        request.execute("[dbo].sp_getContractorProfile").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }
                            conn.close();
                            return resolve(mainKey[selectedKey]);
                        }).catch(function(err) {
                            data.msg.Code = 500;
                            //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                            data.msg.Message = err.message;

                            conn.close();
                            return reject(data);
                        });
                    }).catch(function(err) {
                        data.msg.Code = 500;
                        data.msg.Message = err.message;
                        conn.close();
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

}