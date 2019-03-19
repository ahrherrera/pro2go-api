var fs = require("fs"),
    json,
    sql = require('mssql');

var pool;

function getPath(file) {
    var path = __dirname + '/' + file;

    return path;
}

function getConnection() {
    var data = fs.readFileSync(getPath('./connectionsConfig.json'), 'utf8');
    json_file = JSON.parse(data);

    var conn = {};
    conn = json_file[0].freeAgent;

    pool = new sql.ConnectionPool({
        user: conn.user,
        password: conn.password,
        server: conn.server,
        database: conn.database
    });

    return pool;
}


//Connection to DB
exports.findConfig = function() {
    //get COnfig	
    return getConnection();
};