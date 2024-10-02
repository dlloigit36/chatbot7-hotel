import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";

const app = express();
// const webPort = 3017;
const webPort = process.env.WEB_PORT;
const API_HOST = process.env.API_HOSTNAME;
const API_PORT = process.env.API_PORT;
const API_URL = `http://${API_HOST}:${API_PORT}`;

const APIKey = process.env.API_ACCESS_KEY;
const config = {
    params: { key: APIKey}
};

const shopName = process.env.SHOP_NAME;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// authenticate with username name and password from env variable
const dbUser = [
  { id: 1,
    username: process.env.WEB_USERNAME,
    password: process.env.WEB_USERPASSWORD
  }
];


let currentServiceId = 1;
let error = "";

async function getAllService() {
  // http://localhost:3007/mainservice/all
  let serviceList = [];
  try {
    const response = await axios.get(API_URL + "/mainservice/all", config);
    serviceList = response.data;
  } catch (error) {
    console.log(error);
  }
  return serviceList;
}

async function getRequestBySid(sid) {
  // http://localhost:3007/request/search?sid=1
  // get guest_request list by main service id
  let requestList = [];
  try {
    const response = await axios.get(API_URL + "/request/search?sid=" + sid, config);
    requestList = response.data;
  } catch (error) {
    // res.status(500).json({ message: "Error fetching API data" });
    console.log(error);
  }
  return requestList;
  
}

async function getGuestByTel(tel) {
  // http://localhost:3007/guest/search?tel=60121234567
  // get guest details by mobile number tel
  let guestList = [];
  try {
    const response = await axios.get(API_URL + "/guest/search?tel=" + tel, config);
    guestList = response.data;
  } catch (error) {
    // res.status(500).json({ message: "Error fetching API data" });
    console.log(error);
  }
  return guestList;
  
}

async function getAllFood() {
  // http://localhost:3007/foodmenu/all
  let foodList = [];
  try {
    const response = await axios.get(API_URL + "/foodmenu/all", config);
    foodList = response.data;
  } catch (error) {
    console.log(error);
  }
  return foodList;
}

// logout
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// login page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// login post page to accept username and password
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);


// Route to render the main page
app.get("/", async (req, res) => {
  // console.log("in home route / before req.isAuthenticated", req.user);
  if (req.isAuthenticated()) {
    const allService = await getAllService();
    const requestByServiceId = await getRequestBySid(currentServiceId);
    // console.log("in root / currentServiceId = ", currentServiceId);
    // console.log("in root / request list by service id = ", requestByServiceId[0]);
    res.render("index.ejs", { 
      currentTime: new Date(),
      serviceList: allService,
      serviceProfile: currentServiceId,
      requestList: requestByServiceId,
      requestTotal: requestByServiceId.length,
      shopName: shopName,
      error: error 
    });
  } else {
    console.log("not authenticated");
    res.redirect("/login");
  }
  
  
});

// a route to get service id and display new tab for front desk/kitchen service id
app.post("/service", async (req, res) => {
  if (req.isAuthenticated()) {
      switch (req.body.service) {
      case "newFood":
        res.redirect("/foodmenu");
        break;

      case "addGuest":
        res.redirect("/addguest")
        break;
    
      default:
        currentServiceId = req.body.service;
        res.redirect("/");
        break;
    }
  } else {
    console.log("not authenticated in service post");
  }
  
  // console.log("in /service printing req.body.service value = ", req.body.service);
  
});

// a route a accept service status id hit from Acknowledge button
app.get("/rstatus/ack/:statusId", async (req, res) => {
  if (req.isAuthenticated()) {
    let requestStatusId = parseInt(req.params.statusId);
    console.log("in /rstatus/ack/:statusId request_status.id = ", requestStatusId);

    let currentDate = new Date();
    // console.log(currentDate);
        
    var patchRequestStatus = {
      id: requestStatusId,
      ack_bool: 1,
      ack_d: new Date()
    }

    try {
      const result = await axios.patch(API_URL + "/patch/rstatus/"+ requestStatusId, patchRequestStatus, config);
      console.log("patch request_status ack done for requestId = ", requestStatusId, "return =",result.data);
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }

    res.redirect("/");
  } else {
    console.log("not authenticated in rstatus/ack");
  }
    
});

// a route a accept service status id hit from Delivered button
app.get("/rstatus/delivered/:statusId", async (req, res) => {
  if (req.isAuthenticated()) {
    let requestId = parseInt(req.params.statusId);
  console.log("in /rstatus/delivered/:statusId request_status.id = ", requestId);

  let currentDate = new Date();
    
    var patchRequestStatusData = {
      id: requestId,
      deliver_bool: 1,
      deliver_d: new Date()
    }

    try {
      const result = await axios.patch(API_URL + "/patch/rstatus/deliver/"+ requestId, patchRequestStatusData, config);
      console.log("patch request_status delivered done for requestId = ", requestId, "return =",result.data);
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }

    res.redirect("/");
  } else {
    console.log("not authenticated in rstatus/delivered")
  }
  
});

// a route to show page to search guest details by mobile number
app.get("/addguest", async (req, res) => {
  if (req.isAuthenticated()){
      // sample return guest details from API 
    let returnGuestDetail = [];

    let searchMobile = true;
    let foundAddStay = false;
    let newAddStay = false;
    res.render("add-guest.ejs", {
      searchMobile: searchMobile,
      foundAddStay: foundAddStay,
      newAddStay: newAddStay,
      guestDetail: returnGuestDetail,
      message: "this is test message"
    });
  } else {
    console.log("not authenticated in addguest");
  }
  
});

// route where guest mobile entered and search button clicked
app.post("/searchbytel", async (req, res) => {
  if (req.isAuthenticated()) {
      let guestTel = req.body.tel;
    // console.log("entered guest bobile number = ", guestTel);

    let searchMobile = true;
    let foundAddStay = true;
    let newAddStay = true;
    let telInSearch = "";

    let returnGuestDetail = [];
    try {
      returnGuestDetail = await getGuestByTel(guestTel);
      
    } catch (error) {
      console.log("error query guest list by tel number got error=", error);
    }
    

    // if search return no record, render add guest and stay
    // else render add stay with guest details populated
    if (returnGuestDetail.length == 0) {
      searchMobile = false;
      foundAddStay = false;
      newAddStay = true;
    } else if (returnGuestDetail.length != 0) {
      searchMobile = false;
      foundAddStay = true;
      newAddStay = false;
    }

    
    res.render("add-guest.ejs", {
      searchMobile: searchMobile,
      foundAddStay: foundAddStay,
      newAddStay: newAddStay,
      guestDetail: returnGuestDetail,
      telInSearch: guestTel,
      message: "this is test message"
    });
  } else {
    console.log("not authenticated in searchbytel");
  }
  
});

// a route search tel return guest details. POST existing guest details with room number and check-in date and out
app.post("/addgueststay", async (req, res) => {
  if (req.isAuthenticated()) {
      let guestId = req.body.guestId;
    
    let postGustStay = {
      guestId: req.body.guestId,
      roomNumber: req.body.roomNumber,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate
    };
    // pass guest stay information to back end API server
    try {
      const result = await axios.post(API_URL + "/post/gueststay", postGustStay, config);
      console.log("post guest_stay record done for guest id = ", guestId, "return =",result.data);
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }

    
    res.redirect("/addguest");
  } else {
    console.log("not authenticated in post addgueststay");
  }
  
});

// a route search tel return no record. POST new complete guest details and others.
app.post("/addguestandstay", async (req, res) => {
  if (req.isAuthenticated()) {
      // no guest id as guest record not exist. this to create guest record then add stay
    
    let postGuestAndStay= {
      guestFirstname: req.body.guestFirstname,
      guestLastName: req.body.guestLastName,
      guestTel: req.body.guestTel,
      roomNumber: req.body.roomNumber,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate
    };

    // pass guest details and stay information to back end API server
    try {
      const result = await axios.post(API_URL + "/post/addguestandstay", postGuestAndStay, config);
      console.log("posted guest_detail and guest_stay record done for new guest. return =", result.data);
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }

    res.redirect("/addguest");
  } else {
    console.log("not authenticated in post addguestandstay");
  }
  
});



// a route to edit food menu
app.get("/foodmenu", async (req, res) => {
  if (req.isAuthenticated()) {
    const qFoodList = await getAllFood();
  // console.log(qFoodList);

  res.render("foodmenu.ejs", {
    foodList: qFoodList
  });
  } else {
    res.redirect("/");
    console.log("not authenticated in get foodmenu");
  }
  
});

// a route to get selected food items for render into mmodifyfood.ejs
app.get("/fooditem/edit/:id", async (req, res) => {
  // http://localhost:3007/foodmenu/search?id=2
  if (req.isAuthenticated()) {
      const id = parseInt(req.params.id);
    // console.log("inside GET /fooditem/edit/:id foodID =", id);
    // const editFoodIndex = foodList.findIndex((food) => food.id === id);
    // console.log(foodList[editFoodIndex]);
    let editFoodItem = [];
    try {
      const result = await axios.get(API_URL + "/foodmenu/search?id="+ id, config);
      // console.log("GET to get food menu item by id = ", id, "return =",result.data);
      editFoodItem = result.data;
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }


    res.render("modifyfood.ejs", {
      editFoodItem: editFoodItem[0]
    });
  } else {
    console.log("not authenticated in get fooditem/edit/id");
  }
  
});

// a route when updated food item POST hits
app.post("/fooditem/edit/:id", async (req, res) => {
  if (req.isAuthenticated()) {
      const id = parseInt(req.params.id);
    
    let updateFoodItem = {
      id: id,
      title: req.body.foodTitle,
      type: req.body.foodType,
      description: req.body.foodDescription,
      price: req.body.foodPrice
    }

    try {
      const result = await axios.patch(API_URL + "/patch/foodmenu/"+ id, updateFoodItem, config);
      console.log("patch food_menu item done for food id = ", id, "return =",result.data);
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }

    // console.log(updateFoodItem);
    
    res.redirect("/foodmenu");

  } else {
    console.log("not authenticated in post fooditem/edit/id");
  }
  
});

// a route to delete secleted food with foodId
app.get("/fooditem/delete/:id", async (req, res) => {
  if (req.isAuthenticated()) {
      // const id = parseInt(req.params.id);
    // console.log("inside GET /fooditem/delete/:id foodID =", req.params.id);

    try {
      const qResult = await axios.delete(`${API_URL}/delete/foodmenu/${req.params.id}`, config);
      console.log("delete food item done for food id = ", req.params.id, "return =", qResult.data);
      
    } catch (error) {
      res.status(500).json({ message: "Error deleting selected food item" });
    }

    res.redirect("/foodmenu");
  } else {
    console.log("not authenticated in get fooditem/delete/id");
  }

});

// a route to add new food
app.get("/newfood", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("modifyfood.ejs");
  } else {
    res.redirect("/");
    console.log("not authenticated in get newfood");
  }
  
});

// a route where addnewfood page button Add to be hit
app.post("/addnewfood", async (req, res) => {
  if (req.isAuthenticated()) {
      let postNewFood= {
      foodTitle: req.body.foodTitle,
      foodDescription: req.body.foodDescription,
      foodType: req.body.foodType,
      foodPrice: parseFloat(req.body.foodPrice)
    };

    // pass food details and entered information to back end API server
    try {
      const result = await axios.post(API_URL + "/fooditem/addfood", postNewFood, config);
      console.log("posted food_menu with new food item. return =", result.data);
      
    } catch (error) {
      console.log("error connecting to API = ", error.stack);
    }


    res.redirect("/foodmenu");
  } else {
    res.redirect("/");
    console.log("not authenticated in post addnewfood");
  }

  
});

// manage logon session and cookie
passport.use(new Strategy(function verify(username, password, cb) {
  // console.log(username);
  // console.log(password);
  try {
    const result = dbUser;
    if (result.length > 0) {
      const user = result[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, valid) => {
        if (err) {
          //Error with password check
          console.error("Error comparing passwords:", err);
          return cb(err);
        } else {
          if (valid) {
            //Passed password check
            return cb(null, user);
          } else {
            //Did not pass password check
            console.log("Did not pass password check");
            return cb(null, false);
          }
        }
      });
    } else {
      return cb("User not found");
    }
  } catch (err) {
    console.log(err);
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});



app.listen(webPort, () => {
    console.log(`web-Hotel server is running on http://localhost:${webPort}`);
  });
  