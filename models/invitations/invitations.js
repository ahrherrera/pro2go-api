var config = require("../../controllers/mssql/mssqlconnector"),
    sql = require('mssql'),
    jwt = require('jsonwebtoken');
var admin = require('firebase-admin');

var serviceAccount = require('../../iglesiatechapp-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const TypeNotification = {
    INVITE: 0,
    CONFIRMATION: 1
}

exports.getInvitations = function(req) {
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
                        request.input('ProfileID', sql.Int, authData.User.Profile.id);

                        request.execute("dbo.sp_getInvitations").then(function(recordsets) {
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

exports.getSingleInvitation = function(req) {
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
                        request.input('InvitationID', sql.Int, req.body.id);

                        request.execute("dbo.[sp_getSingleInvitation]").then(function(recordsets) {
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

exports.getSentInvitations = function(req) {
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
                        request.input('ProfileID', sql.Int, authData.User.Profile.id);

                        request.execute("dbo.sp_getSentInvitations").then(function(recordsets) {
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

exports.invite = function(req) {
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
                        request.input('ProfileID', sql.Int, req.body.profileID);
                        request.input('SearchID', sql.Int, req.body.searchID);

                        request.execute("dbo.sp_Invite").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }
                            conn.close();

                            // Send Push Notification to other User

                            getDevices(req.body.profileID).then(data => {

                                var tokenDev = JSON.parse(data).RegistrationID;
                                console.log(tokenDev);

                                var message = {
                                    notification: {
                                        title: 'New Request arrived!',
                                        body: 'You have a new request from a Customer',
                                    },
                                    data: {
                                        type: String(TypeNotification.INVITE)
                                    },
                                    android: {
                                        notification: {
                                            clickAction: "FCM_PLUGIN_ACTIVITY"
                                        }
                                    },
                                    token: tokenDev
                                };

                                // Send a message to the device corresponding to the provided
                                // registration token.
                                admin.messaging().send(message)
                                    .then((response) => {
                                        // Response is a message ID string.
                                        console.log('Successfully sent message:', response);
                                    })
                                    .catch((error) => {
                                        console.log('Error sending message:', error);
                                    });
                            });


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

exports.confirm = function(req) {
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
                        request.input('invitationID', sql.Int, req.body.invitationID);
                        request.input('status', sql.Int, req.body.status);

                        request.execute("dbo.sp_Confirm").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }
                            conn.close();

                            getDevices(req.body.ProfileID).then(data => {
                                var tokenDev = JSON.parse(data).RegistrationID;

                                var bodyD;
                                if (req.body.status == 1) {
                                    body = "Contractor has confirmed the request";
                                } else {
                                    body = "Contractor has declined the request";
                                }

                                var message = {
                                    notification: {
                                        title: 'A Contractor responded your request',
                                        body: bodyD,
                                    },
                                    data: {
                                        type: String(TypeNotification.CONFIRMATION)
                                    },
                                    android: {
                                        notification: {
                                            clickAction: "FCM_PLUGIN_ACTIVITY"
                                        }
                                    },
                                    token: tokenDev
                                };

                                // Send a message to the device corresponding to the provided
                                // registration token.
                                admin.messaging().send(message)
                                    .then((response) => {
                                        // Response is a message ID string.
                                        console.log('Successfully sent message:', response);
                                    })
                                    .catch((error) => {
                                        console.log('Error sending message:', error);
                                    });
                            })


                            return resolve(mainKey[selectedKey]);
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

function getDevices(ProfileID) {
    return new Promise((resolve, reject) => {
        var conn = config.findConfig();
        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('ProfileID', ProfileID);

            request.execute("[dbo].[sp_getDevice]").then(function(recordsets) {
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
                data.msg.Message = err.message;
                conn.close();
                return reject(err);

            });

        }).catch(function(err) {
            conn.close();
            return reject(err);
        });
    });
}