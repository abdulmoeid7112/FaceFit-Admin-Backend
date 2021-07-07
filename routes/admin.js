var express = require("express");
var router = express.Router();

var admin = require("../model/config");
var ad = require("../model/adminModel");

//------------------------------------Setting the permissions-----------------------------------------
var setpermission = function(req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "*");

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
};

//------------------------------------ALL the routes for admin------------------------------------------


//clicking on log in button
router.get("/signin", setpermission, function(req, res, next) {
  console.log(req.body.fullname);
  res.send("open sign in page");
});
//Request for log in
router.post("/signin", setpermission, function(req, res, next) {
 
});

//Request for  profile
router.get("/openProfile", setpermission, function(req,res,next) {

});

//Request for add frame 
router.post("/addFrame",setpermission, function(req,res, next) {
   var brand = req.body.brand;
   frame = {
    "frameName" : req.body.frameName,
    "Color": req.body.Color,
    "Quantity" :  req.body.Quantity,
    "colorAvailable" :  req.body.colorAvailable,
    "material" :  req.body.material,
    "price" :  req.body.price,
    "weight" :  req.body.weight,
    "url":  req.body.url
}
    var userRef = admin.database().ref('Frame').child(brand); 
    userRef.push().set(frame,function(error) {
    if (error) {
        console.log("Data could not be saved." + error);
    } 
    else {
        console.log("Data saved successfully.");
        res.send("ok")
    }
});
});

//Request for specific frame
router.get("/searchFrame/:brand/:name", setpermission, function(req,res,next) {
    var brand = req.params.brand
    var name = req.params.name
    var userRef = admin.database().ref('Frame').child(brand); 
    userRef.orderByChild('frameName').equalTo(name).on("value", function(snapshot) {
      snapshot.forEach(function(data) {
       userRef.child(data.key).on("value", 
      function(snapshot) {
        userRef.off("value");
        console.log(snapshot.val());
        res.send(snapshot.val())
        }, 
      function (errorObject) {
        res.send("The read failed: " + errorObject.code);
     });
      });
  });
});


//Request for frames by brand 
router.get("/frames", setpermission, function(req,res,next) {
  var records = []
  var i = 0
  var userRef  =  admin.database().ref('frames'); 
  userRef.on("value", 
          function(snapshot) {
            // console.log(snapshot.val());
            userRef.off("value");
            // res.json(snapshot.val());
            snapshot.forEach(function(data) {
                 records[i]= data.val()
                //  if(i==2)
                  console.log(' ------ 1',data.val());
                  i = i+1
            })
            res.send(records)
            },
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
         });
  });

//Request for delete frame by name 
router.delete("/deleteFrame",  setpermission, function(req,res,next) {
  ad.deleteFrame(req,res);
});


//Request for Edit frame by name   
router.put("/editFrame/:brand/:name", setpermission, function(req,res,next) {
  console.log("here")
  var brand = req.params.brand
  var name = req.params.name
  frame = {
    "frameName" : req.body.frameName,
    "Color": req.body.Color,
    "Quantity" :  req.body.Quantity,
    "colorAvailable" :  req.body.colorAvailable,
    "material" :  req.body.material,
    "price" :  req.body.price,
    "weight" :  req.body.weight,
    "url":  req.body.url
}
  admin.database().ref("Frame").child(brand).orderByChild('frameName').equalTo(name).on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      admin.database().ref("Frame/"+brand+"/"+data.key+"/").update(frame, 
        function(error) {
           if (error) {
            console.log("Data could not be updated." + error);
            res.send("Data could not be updated." + error);
           } 
           else {
            console.log("Data updated successfully.");
            res.send("Data updated successfully.");
           }
       });
    });
});

});
//Request for book frame 
router.get("/viewBooking", setpermission, function(req,res, next) {
  var records = []
  var i = 0
  var userRef  =  admin.database().ref('bookings'); 
  console.log("66666book")
  userRef.on("value", 
          function(snapshot) {
            userRef.off("value");
            console.log("ggggg")
            snapshot.forEach(function(data) {
              console.log(data.key)
                 records[i]= data.val()
                  console.log(data.val());
                  i = i+1
            })
            res.send(records)
            },
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
         });
  
});
//Request for reciept
router.get("/generateReciept",  setpermission, function(req,res, next) {
  
});

//Request for reciept
router.get("/viewUsers",  setpermission, function(req,res, next) {
var records = []
var i = 0
var userRef  =  admin.database().ref('users'); 
userRef.on("value", 
			  function(snapshot) {
					// console.log(snapshot.val());
          userRef.off("value");
          // res.json(snapshot.val());
          snapshot.forEach(function(data) {
               records[i]= data.val()
                // console.log(data.val());
                i = i+1
          })
          res.send(records)
					},
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
			 });
});

//Request for reciept
router.get("/viewUserDetails/:email",  setpermission, function(req,res, next) {
  var email = req.params.email
  var userRef  =  admin.database().ref('users'); 
  userRef.orderByChild('email').equalTo(email).on("value", function(snapshot) {
    console.log("Whole snap -->   ");
    snapshot.forEach(function(data) {
      console.log(data.key + "  hiiiii")
      res.send(data)
    });
});
});


router.put("/changeStatus",function(req,res,next) {

  var email = req.body.email;
  var status;
  if(req.body.status=="enable"){
     status = "disable";
  }
  else{
    status = "enable";
  }
  console.log(status);

  var userRef  =  admin.database().ref('users'); 
  userRef.orderByChild('email').equalTo(email).on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      var record = data.val();
      record.status = status;
      console.log(data.key+"------------------------------------")
      admin.database().ref("users").child(data.key).update(record, 
        function(error) {
           if (error) {
            console.log("Data could not be updated." + error);
            res.error("Cannot updated");
           } 
           else {
            console.log("Data updated successfully.----------------------------------------");
            res.end("Data updated successfully.");
           }
       });
    });

  
});

})

module.exports = router;
