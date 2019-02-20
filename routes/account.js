var express = require("express");
var router = express.Router();
var accountModel = require("../models/account/account"); // gf
var multer = require('multer');


const picStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(file);
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
            cb(null, 'public/images');
        }else{
            cb(null, 'public/docs');
        }
    },
    filename: function(req, file, cb) {
        cb(null, Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + file.originalname);
    }
});

const picFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const Picupload = multer({
    storage: picStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: picFilter
});
/**
 * Main route, can be reached at localhost:3000/trainer/
 */
router.get("/", function(req, res, next) {
    accountModel // call the promise
        .testConnection(req)
        .then(
            function(response) { //success
                console.log("Success!");
                res.send(response); //return the data
            },
            function(error) { //failed
                console.error("Failed!", error);
                res.status(404).send(error); //return error with 404
            }
        )
        .catch(function(ex) { //exception
            console.error("Exception!", ex);
            res.status(500).send(ex); //return exception with 500
        });
});

router.post("/login", function(req, res, next) {
    accountModel // call the promise
        .login(req)
        .then(
            function(response) { //success
                console.log("Success!");
                res.send(response); //return the data
            },
            function(error) { //failed
                console.error("Failed!", error);
                res.status(404).send(error); //return error with 404
            }
        )
        .catch(function(ex) { //exception
            console.error("Exception!", ex);
            res.status(500).send(ex); //return exception with 500
        });
});

router.post("/register", function(req, res, next) {
    accountModel // call the promise
        .register(req)
        .then(
            function(response) { //success
                console.log("Success!");
                res.send(response); //return the data
            },
            function(error) { //failed
                console.error("Failed!", error);
                res.status(404).send(error); //return error with 404
            }
        )
        .catch(function(ex) { //exception
            console.error("Exception!", ex);
            res.status(500).send(ex); //return exception with 500
        });
});

router.post("/upload", Picupload.single('file'), function(req, res, next) {
    accountModel // call the promise
        .upload(req)
        .then(
            function(response) { //success
                console.log("Success!");
                res.send(response); //return the data
            },
            function(error) { //failed
                console.error("Failed!", error);
                res.status(404).send(error); //return error with 404
            }
        )
        .catch(function(ex) { //exception
            console.error("Exception!", ex);
            res.status(500).send(ex); //return exception with 500
        });
});

module.exports = router;