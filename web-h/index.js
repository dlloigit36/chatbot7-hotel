import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
// const webPort = 3017;
const webPort = process.env.WEB_PORT;
const API_HOST = process.env.API_HOSTNAME;
const API_PORT = process.env.API_PORT;
const API_URL = `http://${API_HOST}:${API_PORT}`;

// const APIKey = "47f2ac60-6b77-4e12-ae38-577275cfa621";
const APIKey = process.env.API_ACCESS_KEY;
const config = {
    params: { key: APIKey}
};

const userName = process.env.WEB_USERNAME;
const userPassword = process.env.WEB_USERPASSWORD;
const shopName = process.env.SHOP_NAME;



app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

// Route to render the main page
app.get("/", async (req, res) => {
  const allService = await getAllService();
  const requestByServiceId = await getRequestBySid(currentServiceId);
  console.log("in root / currentServiceId = ", currentServiceId);
  // console.log("in root / request list by service id = ", requestByServiceId[0]);
  res.render("index.ejs", { 
    currentTime: new Date(),
    serviceList: allService,
    serviceProfile: currentServiceId,
    requestList: requestByServiceId,
    requestTotal: requestByServiceId.length,
    error: error 
  });
});

// a route to get service id and display new tab for front desk/kitchen service id
app.post("/service", async (req, res) => {
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
  console.log("in /service printing req.body.service value = ", req.body.service);
  
});

// a route a accept service status id hit from Acknowledge button
app.get("/rstatus/ack/:statusId", async (req, res) => {
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
});

// a route a accept service status id hit from Delivered button
app.get("/rstatus/delivered/:statusId", async (req, res) => {
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
});

// a route to show page to search guest details by mobile number
app.get("/addguest", async (req, res) => {
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
});

// route where guest mobile entered and search button clicked
app.post("/searchbytel", async (req, res) => {
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
});

// a route search tel return guest details. POST existing guest details with room number and check-in date and out
app.post("/addgueststay", async (req, res) => {
  let guestId = req.body.guestId;
  // let guestFirstname = req.body.guestFirstname;
  // let guestLastName = req.body.guestLastName;
  // let guestTel = req.body.guestTel;
  // let roomNumber = req.body.roomNumber;
  // let checkInDate = req.body.checkInDate;
  // let checkOutDate = req.body.checkOutDate;

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
});

// a route search tel return no record. POST new complete guest details and others.
app.post("/addguestandstay", async (req, res) => {
  // no guest id as guest record not exist. this to create guest record then add stay
  // let guestFirstname = req.body.guestFirstname;
  // let guestLastName = req.body.guestLastName;
  // let guestTel = req.body.guestTel;
  // let roomNumber = req.body.roomNumber;
  // let checkInDate = req.body.checkInDate;
  // let checkOutDate = req.body.checkOutDate;

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
});



// a route to edit food menu
app.get("/foodmenu", async (req, res) => {
  const qFoodList = await getAllFood();
  // console.log(qFoodList);

  res.render("foodmenu.ejs", {
    foodList: qFoodList
  });
});

// a route to get selected food items for render into mmodifyfood.ejs
app.get("/fooditem/edit/:id", async (req, res) => {
  // http://localhost:3007/foodmenu/search?id=2
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
});

// a route when updated food item POST hits
app.post("/fooditem/edit/:id", async (req, res) => {
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

});

// a route to delete secleted food with foodId
app.get("/fooditem/delete/:id", async (req, res) => {
  // const id = parseInt(req.params.id);
  // console.log("inside GET /fooditem/delete/:id foodID =", req.params.id);

  try {
    const qResult = await axios.delete(`${API_URL}/delete/foodmenu/${req.params.id}`, config);
    console.log("delete food item done for food id = ", req.params.id, "return =", qResult.data);
    
  } catch (error) {
    res.status(500).json({ message: "Error deleting selected food item" });
  }

  res.redirect("/foodmenu");
  
  
});

// a route to add new food
app.get("/newfood", async (req, res) => {
  res.render("modifyfood.ejs");
});

// a route where addnewfood page button Add to be hit
app.post("/addnewfood", async (req, res) => {
  // let foodTitle = req.body.foodTitle;
  // let foodDescription = req.body.foodDescription;
  // let foodType = req.body.foodType;
  // let foodPrice = parseFloat(req.body.foodPrice);

  // console.log("in POST /addnewfood, foodTitle =", foodTitle);
  // console.log("in POST /addnewfood, foodDescription =", foodDescription);
  // console.log("in POST /addnewfood, foodType =", foodType);
  // console.log("in POST /addnewfood, foodPrice =", foodPrice);

  let postNewFood= {
    foodTitle: req.body.foodTitle,
    foodDescription: req.body.foodDescription,
    foodType: req.body.foodType,
    foodPrice: parseFloat(req.body.foodPrice)
  };

  // pass guest details and stay information to back end API server
  try {
    const result = await axios.post(API_URL + "/fooditem/addfood", postNewFood, config);
    console.log("posted food_menu with new food item. return =", result.data);
    
  } catch (error) {
    console.log("error connecting to API = ", error.stack);
  }


  res.redirect("/foodmenu");
});



app.listen(webPort, () => {
    console.log(`web-Hotel server is running on http://localhost:${webPort}`);
  });
  