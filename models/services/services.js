var config = require("../../controllers/mssql/mssqlconnector"),
    sql = require('mssql'),
    jwt = require('jsonwebtoken');

exports.getServices = function() {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();

        conn.connect().then(function() {
            var request = new sql.Request(conn);

            request.execute("[dbo].sp_getServices").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }
                var records = mainKey[selectedKey];
                conn.close();
                return resolve(records);

            }).catch(function(err) {
                data.msg.Code = 500;
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
    })
}