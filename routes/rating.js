var express = require("express");
var router = express.Router();

var ratingModel = require("../models/rating/rating");

router.post("/rateCustomer", function(req, res, next) {
    ratingModel // call the promise
        .rateCustomer(req)
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

router.post("/rateContractor", function(req, res, next) {
    ratingModel // call the promise
        .rateContractor(req)
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

router.post("/customerRating", function(req, res, next) {
    ratingModel // call the promise
        .getCustomerReview(req)
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

router.post("/contractorRating", function(req, res, next) {
    ratingModel // call the promise
        .getContractorRating(req)
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