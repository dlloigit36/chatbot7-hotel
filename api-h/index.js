import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();

// API key to check against req.query.key
// const accessAPIKey = "47f2ac60-6b77-4e12-ae38-577275cfa621";
const accessAPIKey = process.env.API_KEY;
const ApiPort = process.env.API_LISTEN_PORT;
const dbUserName = process.env.DB_USERNAME;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

// make postgresql database connection
const db = new pg.Client({
    user: dbUserName,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
  });
db.connect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//GET hotel guest details by varchar tel (alike value) example = http://localhost:3007/guest/search?tel=60121234567
app.get("/guest/search", async (req, res) => {
  let userApiKey = req.query.key;
  let urlSearchTel = req.query.tel;
  console.log("inside guest search by alike tel = ",urlSearchTel);
  if (userApiKey === accessAPIKey) {
    let returnGuestList = [];
    try {
      let guestList = await db.query(
        "SELECT * FROM guest_detail WHERE tel LIKE $1 || '%'",
        [urlSearchTel]);
      // console.log(guestList.rows);
      returnGuestList = guestList.rows;

      res.json(returnGuestList);
    } catch (error) {
      console.log("error connecting to hotel database getting guest list= ", error)
      res.status(500).json({ message: "Error fetching guest list" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//GET hotel guest details by exact value tel example = http://localhost:3007/guest/exactsearch?tel=60121234567
app.get("/guest/exactsearch", async (req, res) => {
  let userApiKey = req.query.key;
  let urlSearchTel = req.query.tel;
  console.log("inside guest search by exact tel = ",urlSearchTel);
  if (userApiKey === accessAPIKey) {
    let returnGuestList = [];
    try {
      let guestList = await db.query(
        "SELECT * FROM guest_detail WHERE tel = $1",
        [urlSearchTel]);
      // console.log(guestList.rows);
      returnGuestList = guestList.rows;

      res.json(returnGuestList);
    } catch (error) {
      console.log("error connecting to hotel database getting exact guest= ", error)
      res.status(500).json({ message: "Error fetching guest by exact tel number" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//GET hotel main service listing example = http://localhost:3007/mainservice/all
app.get("/mainservice/all", async (req, res) => {
  // console.log(req.headers.key);
  const userApiKey = req.query.key;
  if (userApiKey === accessAPIKey) {
    let mainServiceList = [];
    try {
      const returnList = await db.query(
        "SELECT * FROM service_type ORDER BY id ASC"
        );
      // console.log(returnList.rows);
      mainServiceList = returnList.rows;

      res.json(mainServiceList);
    } catch (error) {
      console.log("error connecting to hotel database service type= ", error)
      res.status(500).json({ message: "Error fetching db list" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//GET hotel guest request (where delivered = false) by main service id example = http://localhost:3007/request/search?sid=1
app.get("/request/search", async (req, res) => {
  const userApiKey = req.query.key;
  const serviceId = parseInt(req.query.sid);
  // console.log(serviceId);
  let queryLine = `SELECT guest_request.id requestId, request_description, quantity, requested_d, 
main_service_id, room_number, acknowledged, delivered, request_status.request_id statusid
FROM guest_request
INNER JOIN guest_stay 
ON guest_request.stay_id = guest_stay.id
INNER JOIN request_status
ON guest_request.id = request_status.request_id
WHERE main_service_id = $1 AND delivered = false
ORDER BY guest_request.id ASC;`
  if (userApiKey === accessAPIKey) {
    let returnRequestList = [];
    try {
      const getList = await db.query(queryLine, [serviceId]);
      // console.log(getList.rows);
      returnRequestList = getList.rows;

      res.json(returnRequestList);
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error fetching request list" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//PATCH request_status Ack to true and set ack_d with current date example = http://localhost:3007/patch/rstatus/1
app.patch("/patch/rstatus/:id", async (req, res) => {
  let userApiKey = req.query.key;
  let rquestStatusId = parseInt(req.params.id);

  let updateAck = req.body.ack_bool;
  let updateAck_d = req.body.ack_d;

  // console.log("in API ack_bool = ", req.body.ack_bool);
  // console.log("in API ack_d = ", req.body.ack_d);
  // console.log("in API id = ", req.body.id);

  let queryLine = `UPDATE request_status
  SET acknowledged = $1, ack_d = $2
  WHERE request_id = $3;`

  if (userApiKey === accessAPIKey) {
    try {
      const queryReturn = await db.query(queryLine, [updateAck, updateAck_d, rquestStatusId]);
      // console.log(queryReturn);
      res.json({ message: "request_status ack updated successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error patching request_status record" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//PATCH request_status delivered to true and set delivered_d with current date example = http://localhost:3007/patch/rstatus/deliver/1
app.patch("/patch/rstatus/deliver/:id", async (req, res) => {
  let userApiKey = req.query.key;
  let rquestStatusId = parseInt(req.params.id);

  let updateDelivered = req.body.deliver_bool;
  let updateDelivered_d = req.body.deliver_d;

  // console.log("in API deliver_bool = ", updateDelivered);
  // console.log("in API deliver_d = ", updateDelivered_d);
  // console.log("in API id = ", req.body.id, " and url id = ", rquestStatusId);

  let queryLine = `UPDATE request_status
  SET delivered = $1, delivered_d = $2
  WHERE request_id = $3;`

  if (userApiKey === accessAPIKey) {
    try {
      const queryReturn = await db.query(queryLine, [updateDelivered, updateDelivered_d, rquestStatusId]);
      // console.log(queryReturn);
      res.json({ message: "request_status delivered bool updated successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error patching request_status record with delivered bool" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//POST guest_stay record with guest id from existing guest_details example = http://localhost:3007/post/gueststay
app.post("/post/gueststay", async (req, res) => {
  let userApiKey = req.query.key;
  

  let guestId = req.body.guestId;
  let roomNumber = req.body.roomNumber;
  let checkInDate = req.body.checkInDate;
  let checkOutDate = req.body.checkOutDate;

  // console.log("entered guest id = ", guestId);
  // console.log("entered guest room number = ", roomNumber);
  // console.log("entered guest check-in date and time = ", checkInDate);
  // console.log("entered guest check-out date and time = ", checkOutDate);

  let queryLine = `INSERT INTO guest_stay (room_number, guest_id, check_in_d, check_out_d) VALUES ($1, $2, $3, $4);`

  if (userApiKey === accessAPIKey) {
    try {
      const queryReturn = await db.query(queryLine, [roomNumber, guestId, checkInDate, checkOutDate]);
      // console.log(queryReturn);
      res.json({ message: "guest_stay new record added successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error posting new guest_stay record" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

// to POST new guest_details, then add new guest_stay
app.post("/post/addguestandstay", async (req, res) => {
  let userApiKey = req.query.key;
  

  let guestFirstname = req.body.guestFirstname;
  let guestLastName = req.body.guestLastName;
  let guestTel = req.body.guestTel;
  let roomNumber = req.body.roomNumber;
  let checkInDate = req.body.checkInDate;
  let checkOutDate = req.body.checkOutDate;

  // add new record into guest_details, get RETURNING ID as guest ID
  let qLine1 = `INSERT INTO guest_detail (first_name, last_name, tel) VALUES ($1, $2, $3) RETURNING id;`
  let guestId = -1;

  // add new record into guest_stay
  let queryLine2 = `INSERT INTO guest_stay (room_number, guest_id, check_in_d, check_out_d) VALUES ($1, $2, $3, $4);`

  if (userApiKey === accessAPIKey) {
    try {
      const qReturnId = await db.query(qLine1, [guestFirstname, guestLastName, guestTel]);
      guestId = qReturnId.rows[0].id;

      const queryReturn = await db.query(queryLine2, [roomNumber, guestId, checkInDate, checkOutDate]);
      // console.log(queryReturn);
      res.json({ message: "guest_details and guest_stay new record added successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error posting new guest_stay record" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  };

});

//GET food_menu all food example = http://localhost:3007/foodmenu/all
app.get("/foodmenu/all", async (req, res) => {
  // console.log(req.headers.key);
  const userApiKey = req.query.key;
  if (userApiKey === accessAPIKey) {
    let foodList = [];
    try {
      const returnList = await db.query(
        "SELECT * FROM food_menu ORDER BY id ASC"
        );
      // console.log(returnList.rows);
      foodList = returnList.rows;

      res.json(foodList);
    } catch (error) {
      console.log("error connecting to hotel database food_menu table= ", error)
      res.status(500).json({ message: "Error fetching food item list" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//GET food_menu item details by food id example = http://localhost:3007/foodmenu/search?id=1
app.get("/foodmenu/search", async (req, res) => {
  const userApiKey = req.query.key;
  const foodId = parseInt(req.query.id);
  // console.log(serviceId);
  let qLine = `SELECT * FROM food_menu WHERE id = $1;`
  if (userApiKey === accessAPIKey) {
    let returnRequestList = [];
    try {
      const getList = await db.query(qLine, [foodId]);
      // console.log(getList.rows);
      returnRequestList = getList.rows;

      res.json(returnRequestList);
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error fetching request list" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

//PATCH food_menu item with updated value example = http://localhost:3007/patch/foodmenu/1
app.patch("/patch/foodmenu/:id", async (req, res) => {
  let userApiKey = req.query.key;
  let foodId = parseInt(req.params.id);

  let uFoodTitle = req.body.title;
  let uFoodDescription = req.body.description;
  let uFoodType = req.body.type;
  let uFoodPrice = req.body.price;

  let qLine = `UPDATE food_menu
  SET food_title = $1, food_description = $2, food_type = $3, price = $4
  WHERE id = $5;`

  if (userApiKey === accessAPIKey) {
    try {
      const queryReturn = await db.query(qLine, [uFoodTitle, uFoodDescription, uFoodType, uFoodPrice, foodId]);
      // console.log(queryReturn);
      res.json({ message: "food menu selected item updated successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error patching request_status record" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

// DELETE food menu item with food id
app.delete("/delete/foodmenu/:id", async (req, res) => {
  let userApiKey = req.query.key;
  const id = parseInt(req.params.id);

  let qLine = `DELETE FROM food_menu WHERE id = $1;`

  if (userApiKey === accessAPIKey) {
    try {
      const queryReturn = await db.query(qLine, [id]);
      // console.log(queryReturn);
      res.json({ message: "food menu selected item deleted successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error deleting food item from food menu" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  }

});

// to POST new food item
app.post("/fooditem/addfood", async (req, res) => {
  let userApiKey = req.query.key;
  

  let foodTitle = req.body.foodTitle;
  let foodDescription = req.body.foodDescription;
  let foodType = req.body.foodType;
  let foodPrice = req.body.foodPrice;
  
  // sql query command to add new food item
  let qLine1 = `INSERT INTO food_menu (food_title, food_description, food_type, price) VALUES ($1, $2, $3, $4);`

  if (userApiKey === accessAPIKey) {
    try {
      const qReturn = await db.query(qLine1, [foodTitle, foodDescription, foodType, foodPrice]);
      
      // console.log(qReturn);
      res.json({ message: "food_menu new record added successfully" });
  
    } catch (error) {
      console.log("error connecting to hotel database= ", error)
      res.status(500).json({ message: "Error posting new food_menu record" });
    }
  } else {
    res
      .status(404)
      .json({error: `you are not authorized.`});
  };

});


app.listen(ApiPort, () => {
  console.log(`API is running at http://localhost:${ApiPort}`);
});
