var express = require("express");
var router = express.Router();
var servicesModel = require("../models/services/services"); // gf


router.get("/getServices", function(req, res, next) {
    servicesModel // call the promise
        .getServices()
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