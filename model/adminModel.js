var admin = require("./config");



addFrame =  function(brand,frame) {
    admin.database().ref("Frame").child(brand).push().set(frame,function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } 
        else {
            console.log("Data saved successfully.");
        }
});
}

viewFrame =  function(brand,req,res)  {
  console.log("vvv")
var userRef = admin.database().ref('Frame'); 
console.log("vvv")
userRef.on("value", 
			  function(snapshot) {
					console.log(snapshot.val());
          userRef.off("value");
          res.send(snapshot.val());
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
			 });
  }

updateFrame =  function(brand,frameName,frame)  {

    console.log("-----------------------updating----------------------------");
    admin.database().ref("frames").orderByChild('name').equalTo(frameName).on("value", function(snapshot) {
        console.log("uo   ->   ");
        snapshot.forEach(function(data) {
          console.log(data.key)
       
            console.log("update  2 -->   "+data.key);
          admin.database().ref("Frame/Rayban/"+data.key+"/").update(frame, 
            function(error) {
               if (error) {
                console.log("Data could not be updated." + error);
               } 
               else {
                console.log("Data updated successfully.");
               }
           });
        });
    });
}
 deleteFrame =  function(req,res) {
  var frameName = req.body.name
  var brand = req.body.brand
    console.log("-----------------------deleting----------------------------"+frameName+"   ---"+brand);
    admin.database().ref("frames").orderByChild('name').equalTo(frameName).on("value", function(snapshot) {
        console.log("upppp   ->   ");
        snapshot.forEach(function(data) {
            console.log("anadar   "+data.key);
            admin.database().ref("frames/"+data.key+"/").update({"name":"deleted"}, 
              function(error) {
                 if (error) {
                  console.log("Data could not be deleted" + error);
                  res.send("Not deleted")
                 } 
                 else {
                  console.log("Data deleted successfully.");
                  res.send("deleted")
                } 
                 })
                })

              })
}

searchFrame =  function(brand,frameName)  {
    console.log("-----------------------Searching----------------------------");
    admin.database().ref("Frame").child(brand).orderByChild('frameName').equalTo(frameName).on("value", function(snapshot) {
        console.log("Whole snap -->   ");
        snapshot.forEach(function(data) {
          console.log(data.key)
        });
    });

  

}

module.exports = {
  addFrame,
  searchFrame,
  viewFrame,
  deleteFrame,
  updateFrame
};

