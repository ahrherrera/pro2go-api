var config = require("../../controllers/mssql/mssqlconnector"),
    sql = require('mssql'),
    jwt = require('jsonwebtoken'),
    nodemailer = require('nodemailer');

const keyPublishable = 'pk_test_Oi0s8V9Ep0SXVMCvYTPmDgrl';
const keySecret = 'sk_test_xZnz2FqdtfdCh56p56axEftb';

const stripe = require("stripe")(keySecret);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thefreeagent.app@gmail.com',
        pass: 'admine2O'
    }
});

//Module export returning a promise

exports.testConnection = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!

        var conn = config.findConfig();

        conn.connect().then(function() {
            console.log(req);
            conn.close();
            return resolve('Connection successful');

        }).catch(function(err) {
            conn.close();
            return reject(err);
        })
    });
};

exports.login = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();

        conn.connect().then(function() {
            var request = new sql.Request(conn);
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
                    conn.close();
                    data.msg.Code = 400;
                    data.msg.Message = mainKey.Mensaje;
                    return resolve(data);
                } else {
                    conn.close();
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
                conn.close();
                return reject(err);

            });

        }).catch(function(err) {
            conn.close();
            return reject(err);
        });
    });
};

exports.registerContractor = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        console.log("Services", req.body.Services);

        var conn = config.findConfig();
        conn.connect().then(function() {
            var request = new sql.Request(conn);
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
            request.input('license', sql.VarChar(50), req.body.license);
            request.input('insurance', sql.Bit, req.body.insurance);
            request.input('ServiceTypes', sql.NVarChar(sql.MAX), req.body.Stype);

            request.execute("[dbo].sp_CreateUser").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }

                let rdata = JSON.parse(mainKey[selectedKey]);
                console.log(rdata);
                if (rdata.estatus == 0) {
                    data.msg.Code = 400;
                    data.msg.Message = rdata.message;
                    conn.close();
                    return reject(data);
                } else {
                    jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                        data = {
                            token: token
                        };
                        return resolve(data);
                    });
                    conn.close();
                }
            }).catch(function(err) {
                data.msg.Code = 500;
                //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                data.msg.Message = err.message;
                conn.close();
                return reject(err);
            });
        }).catch(function(err) {
            data.msg.Code = 500;
            data.msg.Message = err.message;
            conn.close();
            return reject(err);
        });
    });
};

exports.registerCustomer = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();
        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('Names', sql.VarChar(150), req.body.Names);
            request.input('Email', sql.VarChar(100), req.body.Email);
            request.input('phone', sql.VarChar(15), req.body.phone);
            request.input('address', sql.VarChar(100), req.body.address);
            request.input('Services', sql.NVarChar(sql.MAX), null);
            request.input('TypeID', sql.Int, req.body.type);
            request.input('username', sql.VarChar(150), req.body.username);
            request.input('password', sql.VarChar(100), req.body.password);
            request.input('city', sql.VarChar(100), req.body.city);
            request.input('zip', sql.VarChar(20), req.body.zip);
            request.input('picUrl', sql.VarChar(300), req.body.photo);
            request.input('CertificateURL', sql.VarChar(300), null);
            request.input('budget', sql.VarChar(100), null);
            request.input('availability', sql.VarChar(100), null);
            request.input('hire', sql.Bit, null);
            request.input('bid', sql.Bit, null);
            request.input('timeFrame', sql.VarChar(300), null);
            request.input('license', sql.VarChar(50), null);
            request.input('insurance', sql.Bit, null);
            request.input('ServiceTypes', sql.NVarChar(sql.MAX), null);

            request.execute("[dbo].sp_CreateUser").then(function(recordsets) {
                let rows = recordsets.recordset;
                var mainKey = rows[0];
                var selectedKey;
                for (var key in mainKey) {
                    selectedKey = key;
                }

                let rdata = JSON.parse(mainKey[selectedKey]);
                if (rdata.estatus == 0) {
                    data.msg.Code = 400;
                    data.msg.Message = rdata.message;
                    conn.close();
                    return reject(data);
                } else {
                    jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                        data = {
                            token: token
                        };
                        return resolve(data);
                    });
                    conn.close();
                }
            }).catch(function(err) {
                data.msg.Code = 500;
                //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                data.msg.Message = err.message;
                conn.close();
                return reject(err);
            });
        }).catch(function(err) {
            data.msg.Code = 500;
            data.msg.Message = err.message;
            conn.close();
            return reject(err);
        });
    });
};

exports.upload = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
        console.log(req);
        if (req.file) {
            var destination = req.file.destination;
            var normalized = destination.substring('public/'.length);
            return resolve({ response: normalized + "/" + req.file.filename });
        } else {
            return reject({ response: "Error uploading" });
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
                    conn.connect().then(function() {
                        var request = new sql.Request(conn);
                        request.input('profileID', sql.Int, authData.User.Profile.id);
                        request.input('Latitude', sql.Decimal(9, 6), req.body.lat);
                        request.input('Longitude', sql.Decimal(9, 6), req.body.lng);

                        request.execute("[dbo].sp_updateLocation").then(function(recordsets) {
                            conn.close();
                            return resolve(data);
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
};

exports.saveInformation = function(req) {
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
                    //Create customer Token

                    if (authData.User.Profile.CustomerID != null) {
                        //Update
                        console.log("Updating...");
                        var customerID = authData.User.Profile.CustomerID;
                        console.log("Customer ID: " + customerID);
                        stripe.customers.update(authData.User.Profile.CustomerID, {
                                source: req.body.stripeToken
                            },
                            function(err, customer) {
                                if (!err) {
                                    conn.connect().then(function() {
                                        var request = new sql.Request(conn);
                                        request.input('ProfileID', sql.Int, authData.User.Profile.id);
                                        request.input('token', sql.VarChar(100), customer.id);
                                        request.execute("[dbo].sp_saveCustomerInfo").then(function(recordsets) {
                                            conn.close();
                                            let rows = recordsets.recordset;
                                            var mainKey = rows[0];
                                            var selectedKey;
                                            for (var key in mainKey) {
                                                selectedKey = key;
                                            }

                                            jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                                                data = {
                                                    token: token
                                                };
                                                return resolve(data);
                                            });
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
                                } else {
                                    console.log(err);
                                    data.msg.Code = 400;
                                    data.msg.Message = "Error updating cutomer";
                                    return reject(data);
                                }
                            });
                    } else {
                        //Create
                        stripe.customers.create({
                            email: authData.User.Profile.Email,
                            source: req.body.stripeToken
                        }, function(err, customer) {
                            //customer.id
                            if (!err) {
                                conn.connect().then(function() {
                                    var request = new sql.Request(conn);
                                    request.input('ProfileID', sql.Int, authData.User.Profile.id);
                                    request.input('token', sql.VarChar(100), customer.id);


                                    request.execute("[dbo].sp_saveCustomerInfo").then(function(recordsets) {
                                        conn.close();

                                        let rows = recordsets.recordset;
                                        var mainKey = rows[0];
                                        var selectedKey;
                                        for (var key in mainKey) {
                                            selectedKey = key;
                                        }

                                        jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                                            data = {
                                                token: token
                                            };
                                            return resolve(data);
                                        });
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
                            } else {
                                data.msg.Code = 400;
                                data.msg.Message = "Error creating cutomer";
                                return reject(data);
                            }

                        });
                    }
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

exports.pay = function(req) {
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

                    //obtain the customer info

                    conn.connect().then(function() {
                        var request = new sql.Request(conn);
                        request.input('ProfileID', sql.Int, authData.User.Profile.id);

                        request.execute("[dbo].sp_Retrieve").then(function(recordsets) {
                            conn.close();
                            // return resolve(data);
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }

                            var customerID = mainKey.customer_id;

                            //Charge

                            console.log(customerID);

                            var amount;

                            if (req.body.type == 0) {
                                amount = 14.99 * 100;
                            } else if (req.body.type == 1) {
                                amount = 9.99 * 100;
                            } else if (req.body.type == 2) {
                                amount = 5.99 * 100;
                            }

                            stripe.charges.create({
                                amount,
                                description: req.body.description,
                                currency: "usd",
                                customer: customerID,
                                receipt_email: authData.User.Profile.Email
                            }).then(charge => {
                                if (charge.paid == true) {

                                    //Save Payment Info
                                    conn.connect().then(function() {
                                        var request = new sql.Request(conn);
                                        request.input('ProfileID', sql.Int, authData.User.Profile.id);
                                        request.input('charge', sql.VarChar(100), charge.id);
                                        request.input('amount', sql.Money, amount / 100);
                                        request.input('description', sql.VarChar(200), req.body.description);

                                        request.execute("[dbo].sp_savePayment").then(function(recordsets) {
                                            let rows = recordsets.recordset;
                                            var mainKey = rows[0];
                                            var selectedKey;
                                            for (var key in mainKey) {
                                                selectedKey = key;
                                            }

                                            jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                                                data = {
                                                    message: "Charged Successfully",
                                                    Estado: 1,
                                                    token: token
                                                };
                                                return resolve(data);
                                            });

                                            conn.close();
                                        }).catch(function(err) {
                                            data.msg.Code = 500;
                                            //TODO: EN produccion cambiar mensajes a "Opps! Something ocurred."
                                            data.msg.Message = err.message;
                                            conn.close();
                                            return reject(data);
                                        });
                                    }).catch(function(err) {
                                        console.log(err);
                                        data.msg.Code = 500;
                                        data.msg.Message = err.message;
                                        conn.close();
                                        return reject(data);
                                    });

                                } else {
                                    return resolve({ message: "Not charged", Estado: 0, payload: charge });
                                }
                            })


                        }).catch(function(err) {
                            console.log(err);
                            data.msg.Code = 500;
                            data.msg.Message = err.message;
                            conn.close();
                            return reject(data);
                        });
                    }).catch(function(err) {
                        data.msg.Code = 500;
                        data.msg.Message = err.message;
                        conn.close();
                        console.log(err);
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

exports.getTokens = function(req) {
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

                    if (authData.User.Profile.CustomerID != null) {
                        stripe.customers.retrieve(authData.User.Profile.CustomerID,
                            function(err, customer) {
                                if (!err) {
                                    return resolve(customer.sources);
                                } else {

                                }
                            });
                    } else {
                        return resolve({ Estado: 0, message: "User does not have registered yet" });
                    }
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

exports.updateCustomer = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
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
                        request.input('Phone', sql.NVarChar(15), req.body.phone);
                        request.input('Email', sql.NVarChar(100), req.body.email);
                        request.input('Address', sql.NVarChar(100), req.body.address);
                        request.input('City', sql.NVarChar(100), req.body.city);
                        request.input('State', sql.NVarChar(50), req.body.state);
                        request.input('ZipCode', sql.VarChar(20), req.body.zip);

                        if (req.body.pic != "null") {
                            request.input('picUrl', sql.NVarChar(300), req.body.pic);
                            console.log("Setting picture");
                        } else {
                            request.input('picUrl', sql.NVarChar(300), 'N/A');
                            console.log("Setting null");
                        }

                        request.execute("[dbo].[sp_UpdateCustomer]").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }
                            if (mainKey.Status == 0) {
                                conn.close();
                                data.msg.Code = 400;
                                data.msg.Message = mainKey.Mensaje;
                                return resolve(data);
                            } else {
                                conn.close();
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
                            conn.close();
                            return reject(err);

                        });

                    }).catch(function(err) {
                        conn.close();
                        return reject(err);
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

exports.updateContractor = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
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
                        request.input('Phone', sql.NVarChar(15), req.body.phone);
                        request.input('Email', sql.NVarChar(100), req.body.email);
                        request.input('Address', sql.NVarChar(100), req.body.address);
                        request.input('City', sql.NVarChar(100), req.body.city);
                        request.input('State', sql.NVarChar(50), req.body.state);
                        request.input('ZipCode', sql.VarChar(20), req.body.zip);
                        request.input('Insurance', sql.Bit, req.body.insurance);
                        request.input('License', sql.VarChar(50), req.body.license);
                        request.input('Budget', sql.Money, req.body.budget);
                        request.input('stype', sql.NVarChar(sql.MAX), req.body.stype);

                        if (req.body.pic != "null") {
                            request.input('picUrl', sql.NVarChar(300), req.body.pic);
                        } else {
                            request.input('picUrl', sql.NVarChar(300), 'N/A');
                        }

                        if (req.body.cert != "null") {
                            request.input('certUrl', sql.NVarChar(300), req.body.cert);
                        } else {
                            request.input('certUrl', sql.NVarChar(300), 'N/A');
                        }

                        if (req.body.services != "null") {
                            request.input('services', sql.NVarChar(300), req.body.services);
                        } else {
                            request.input('services', sql.NVarChar(300), 'N/A');
                        }

                        request.execute("[dbo].[sp_UpdateContractor]").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }
                            if (mainKey.Status == 0) {
                                conn.close();
                                data.msg.Code = 400;
                                data.msg.Message = mainKey.Mensaje;
                                return resolve(data);
                            } else {
                                conn.close();
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
                            conn.close();
                            return reject(err);

                        });

                    }).catch(function(err) {
                        conn.close();
                        return reject(err);
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

exports.updateAvailability = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
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
                        request.input('availability', sql.Int, req.body.availability);

                        request.execute("[dbo].[sp_changeAvailability]").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            var mainKey = rows[0];
                            var selectedKey;
                            for (var key in mainKey) {
                                selectedKey = key;
                            }
                            conn.close();
                            jwt.sign(JSON.parse(mainKey[selectedKey]), 'Y2Ae7kXZ', (err, token) => {
                                data = {
                                    token: token
                                };
                                return resolve(data);
                            });

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

exports.updateDevice = function(req) {
    return new Promise((resolve, reject) => { //return promise, callbacks are bad!
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
                        request.input('Token', sql.NVarChar(500), req.body.registration);

                        request.execute("[dbo].[sp_UpdatePushToken]").then(function(recordsets) {
                            // let rows = recordsets.recordset;
                            // var mainKey = rows[0];
                            // var selectedKey;
                            // for (var key in mainKey) {
                            //     selectedKey = key;
                            // }
                            conn.close();
                            return resolve(data);

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
exports.verifyCode = function(req) {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();


        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('Code', sql.VarChar(6), req.body.code);
            request.input('User', sql.Int, req.body.user);

            request.execute("dbo.sp_verifyCode").then(function(recordsets) {
                let rows = recordsets.recordset;
                conn.close();
                return resolve(rows[0]);
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

exports.resetPassword = function(req) {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();


        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('Code', sql.VarChar(6), req.body.code);
            request.input('Password', sql.VarChar(100), req.body.password);
            request.input('User', sql.Int, req.body.user);

            request.execute("dbo.sp_ResetPassword").then(function(recordsets) {
                let rows = recordsets.recordset;
                conn.close();

                //Antes de enviar la respuesta, enviar el email

                return resolve(rows[0]);
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

exports.sendCode = function(req) {
    return new Promise((resolve, reject) => {
        var data = {};
        data.msg = { Code: 200, Message: 'Exito!', Tipo: 'n/a' };

        var conn = config.findConfig();


        conn.connect().then(function() {
            var request = new sql.Request(conn);
            request.input('Email', sql.VarChar(100), req.body.email);

            request.execute("dbo.sp_SendCode").then(function(recordsets) {
                let rows = recordsets.recordset;
                conn.close();

                //Antes de enviar la respuesta, enviar el email

                if (rows[0].Estado) {
                    const mailOptions = {
                        from: 'thefreeagent.app@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'Your verification code to Reset Your Password', // Subject line
                        html: '<p style="Margin-top: 0;Margin-bottom: 20px;text-align: center;"><span style="color:#000">Your verification code is&nbsp;<strong>' + rows[0].Reset_CODE + '</strong><br /><br />Return to the app and type this code.</span></p>' // plain text body
                    };

                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err)
                            console.log(err);
                        else
                            console.log(info);
                    });
                }

                return resolve(rows[0]);
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

exports.changePassword = function(req) {
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
                    conn.connect().then(function() {
                        var request = new sql.Request(conn);
                        request.input('ID', sql.Int, authData.User.UserID);
                        request.input('ActualPassword', sql.VarChar(100), req.body.oldPass);
                        request.input('NewPassword', sql.VarChar(100), req.body.newPass);

                        request.execute("[dbo].sp_ChangePassword").then(function(recordsets) {
                            let rows = recordsets.recordset;
                            conn.close();
                            return resolve(rows[0]);
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
};