const express = require("express");
const router = express.Router();
const mysql = require("promise-mysql");
const fs = require("fs");
const socketServer = require("../utils/socketHelper");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  //mark the line bellow when only when creating table in createDB router
  database: "vacationDB",
  connectionLimit: 10,
});


//Login auth
router.get("/isUserLogin", async function (req, res) {
  if (req.session.UserConnect === true) {
    res.send(true);
  } else {
    res.send(false);
  }
});


//Admin auth
router.get("/isAdmin", async function (req, res) {
  if (req.session.isAdmin === true) {
    res.send({ switch: "AdminHomePage" });
  } else {
    res.send({ switch: "UserHomePage" });
  }
});


//Login
router.post("/Login", async function (req, res, next) {

  const Login = `SELECT * FROM Users
    WHERE UserName = '${req.body.UserName}' AND PASS = '${req.body.Password}';`;

  const resp = await pool.query(Login);

  if (resp.length > 0 || req.session.UserConnect === true) {
    // req.session.isAdmin = false;

    if (resp[0].Permission === "admin") {
      req.session.isAdmin = true;
    }

    req.session.identify = resp[0].id;
    req.session.UserConnect = true;

    res.send(resp);
  }
  
  else {
    res.send({ wrong: "wrong Username or Password" });
  }
});


//Register
router.post("/Register", async function (req, res, next) {
  const LoadUserName =
  `SELECT * FROM Users
   WHERE UserName = '${req.body.UserName}';`;
  
  const resp = await pool.query(LoadUserName);

  if (resp.length > 0) {
    res.send({ wrong: "This username is already used. Try another" });
  } 
  
  else {
    const Register =
    `INSERT INTO Users (FirstName, LastName, UserName, Pass, Permission, Vacations)
     VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${req.body.UserName}', '${req.body.Password}', '0', '[]');`;
    
    const register_resp = await pool.query(Register);
    
    if (register_resp.affectedRows > 0) req.session.identify = register_resp.insertId;
    
    req.session.UserConnect = true;
    res.send({ done: "Register complete" });
  }
});


//Logout
router.get("/Logout", async function (req, res, next) {
  req.session.destroy((err) => console.log(err));
  res.send({ log: "logged out" });
});


//LoadUser
router.get("/LoadUser", async function (req, res, next) {
  if (req.session.UserConnect === true) {
    const LoadVacation =
    `SELECT UserName FROM Users
     WHERE id = '${req.session.identify}'`;
    
    const resp = await pool.query(LoadVacation);
    res.send(resp);
  }
  
  else res.send({ wrong: "something wrong happens" });
});


//LoadVacations
router.get("/LoadVacation", async function (req, res, next) {

  if (req.session.UserConnect === true) {
    const LoadUserVacation =
    `SELECT Vacations FROM Users
     WHERE id = '${req.session.identify}';`;
    
    const resp = await pool.query(LoadUserVacation);
    const UserVacationArray = JSON.parse(resp[0].Vacations);

    const LoadVacation = `SELECT * FROM Vacation;`;

    const vacations = await pool.query(LoadVacation);
    const arr = [];
    const UserArr = [];
    vacations.forEach((r) => {
      let boole = false;
      UserVacationArray.forEach((i) => {
        if (r.id == i) {
          r.checked = "checked";
          UserArr.push(r);
          boole = true;
        }
      });
      if (boole == false) {
        r.checked = "";
        arr.push(r);
      }
    });

    const vacationArr = UserArr.concat(arr);
    res.send(vacationArr);

  } else res.send({ wrong: "somtehing wrong happens" });
});

//StartFollow
router.post("/StartFollow", async function (req, res, next) {
  if (req.session.UserConnect === true) {

    let LoadVacation = `
    SELECT Vacations FROM Users
    WHERE id = '${req.session.identify}'`;

    const resp = await pool.query(LoadVacation);
    let arr = resp[0].Vacations;
    arr = JSON.parse(arr);
    arr.push(req.body.id);
    
    const UpdateVacation =
    `UPDATE Users
     SET Vacations = '[${arr}]'
     WHERE id = '${req.session.identify}';`;
    
    await pool.query(UpdateVacation);
    
    const addFollower =
    `SELECT Followers FROM vacation
     WHERE id = '${req.body.id}'`;
    
    const respAddFollower = await pool.query(addFollower);
    const num = respAddFollower[0].Followers * 1 + 1;
    
    const updateFollower = 
    `UPDATE vacation
     SET Followers = '${num}'
     WHERE id = '${req.body.id}';`;
    
    await pool.query(updateFollower);
    res.send("got");
  }
  
  else res.send({ wrong: "something wrong happens" });
});

//EndFollow
router.post("/EndFollow", async function (req, res, next) {

  if (req.session.UserConnect === true) {
  
    const LoadVacation =
   `SELECT Vacations FROM Users
    WHERE id = '${req.session.identify}'`;
    
    const resp = await pool.query(LoadVacation);
    let arr = resp[0].Vacations;
    arr = JSON.parse(arr);
    arr.forEach((r, i) => {
      if (r == req.body.id) {
        arr.splice(i, 1);
      }
    });

    const UpdateVacation =
    `UPDATE Users
     SET Vacations = '[${arr}]'
     WHERE id = '${req.session.identify}';`;
    
    await pool.query(UpdateVacation);

    const removeFollower =
    `SELECT Followers FROM vacation
     WHERE id = '${req.body.id}'`;
    
    const respAddFollower = await pool.query(removeFollower);
    const num = respAddFollower[0].Followers * 1 - 1;
    const updateFollower =
    `UPDATE vacation
     SET Followers = '${num}'
     WHERE id = '${req.body.id}';`;
    
    await pool.query(updateFollower);

    res.send("got");
  }
  
  else res.send({ wrong: "something wrong happens" });
});

//UpdateVacation
router.put("/UpdateVacation", async function (req, res, next) {

  if (req.session.isAdmin === true) {
    let random = Math.random(1) * 10;
    let relativePath;
    let request = JSON.parse(req.body.state);

    if (req.files) {
      relativePath = "uploads/" + random + req.files.foo.name;
      req.files.foo.mv("public\\uploads\\" + random + req.files.foo.name);
      let path = "public/" + request.Image;
      fs.unlink(path, (err) => {
        console.log(err);
      });
       console.log({relativePath});
    } 
    
    else {
      relativePath = request.Image;
    }

    let UpdateVacation =
    `UPDATE Vacation
     SET Description = '${request.Description}', Destination = '${request.Destination}',
     Image = '${relativePath}', StartDate = '${request.StartDate}',
     EndDate =  '${request.EndDate}', Price = '${request.Price}'
     WHERE id = '${request.id}';`;
    
    const resp = await pool.query(UpdateVacation);

    socketServer.ioServer.emit("reload", "Vacation updated");
    res.send(resp);
  }
  
  else res.send({ wrong: "something wrong happens" });
});

//DeleteVacation
router.delete("/DeleteVacation", async function (req, res, next) {

  if (req.session.isAdmin === true) {
    const path = "public/" + req.body.Image;
    fs.unlink(path, (err) => {
      console.log(err);
    });

    let DeleteVacation =
    `DELETE FROM Vacation
     WHERE id = '${req.body.id}';`;
    
    const resp = await pool.query(DeleteVacation);

    const deleteFromUser =
      `SELECT id, Vacations FROM Users`;
    
    const result = await pool.query(deleteFromUser);

    result.forEach((r) => {
      let arr = JSON.parse(r.Vacations);

      arr.forEach(async (x, i) => {

        if (x == req.body.id) {
          arr.splice(i, 1);

          let UpdateVacation =
          `UPDATE Users
           SET Vacations = '[${arr}]'
           WHERE id = '${r.id}';`;
          
          await pool.query(UpdateVacation);
        }
      });
    });

    socketServer.ioServer.emit("reload", "Vacation Removed");
    res.send(resp);
  }
  
  else res.send({ wrong: "something wrong happens" });
});

/*Here admin can add vacation*/ //done!
router.post("/addVacation", async function (req, res, next) {

  if (req.session.isAdmin === true) {

    let random = Math.random(1) * 100;
    let relativePath = "uploads/" + random + req.files.foo.name;
    req.files.foo.mv("public\\uploads\\" + random + req.files.foo.name);
    const request = JSON.parse(req.body.state);

    const addVacation =
    `INSERT INTO vacation (Description, Destination, Image, StartDate, EndDate, Price, Followers)
     VALUES ('${request.Description}','${request.Destination}','${relativePath}',
     '${request.StartDate}', '${request.EndDate}', '${request.Price}', '0');`;
    
    const resp = await pool.query(addVacation);
    socketServer.ioServer.emit("reload", "Vacation added");
    res.send(resp);
  }
  
  else res.send({ wrong: "something wrong happens" });
});

/*Create DB and Tables*/
// router.get('/createDB', async function (req, res, next) {

//   //before creating db make sure in creating pool that db line marked as note 

//   try {

//     const a= await pool.query("CREATE DATABASE vacationDB");
    
//     console.log({a});//here we already have db lets create table
//     const createUsersTab =
//     `CREATE TABLE vacationDB.Users (
//      id INT NOT NULL AUTO_INCREMENT,
//      FirstName VARCHAR(45) NOT NULL,
//      LastName VARCHAR(45) NOT NULL,
//      UserName VARCHAR(45) NOT NULL,
//      Pass VARCHAR(45) NOT NULL,
//      Permission VARCHAR(45) NOT NULL,
//      Vacations VARCHAR(45) NOT NULL,
//      PRIMARY KEY (id))  `;
//     await pool.query(createUsersTab);

//     const createVacationTable =
//     `CREATE TABLE vacationDB.Vacation (
//      id INT NOT NULL AUTO_INCREMENT,
//      Destination VARCHAR(45) NOT NULL,
//      Description VARCHAR(500) NOT NULL,
//      Image VARCHAR(100) NOT NULL,
//      StartDate VARCHAR(45) NOT NULL,
//      EndDate VARCHAR(45) NOT NULL,
//      Price VARCHAR(45) NOT NULL,
//      Followers VARCHAR(45) NOT NULL,
//      PRIMARY KEY (id))  `;
//     await pool.query(createVacationTable);

//     const adminRegister =
//     `INSERT INTO vacationDB.Users (FirstName, LastName, UserName, Pass, Permission, Vacations)
//      VALUES ('Admin', 'Admin', 'admin', 'admin', 'admin', '[]');`;
//     await pool.query(adminRegister);
    
//     const addVacations =
//     `INSERT INTO vacationDB.Vacation (Destination, Description, Image, StartDate, EndDate, Price, Followers)
//     VALUES ('Barcelona', 'Barcelona is a city in Spain. It is the capital and largest city of Catalonia, as well as the second most populous municipality of Spain. With a population of 1.6 million within city limits,[5] its urban area extends to numerous neighbouring municipalities within the Province of Barcelona and is home to around 4.8 million people,[3][7] making it the sixth most populous urban area in the European Union after Paris, London, Madrid, the Ruhr area and Milan',
//     'uploads/63.04702129320003Barcelona.jpg', '2019-03-06', '2019-03-28', '233', '0'),
//     ('Berlin', 'Berlin straddles the banks of the River Spree, which flows into the River Havel (a tributary of the River Elbe) in the western borough of Spandau. Among the citys main topographical features are the many lakes in the western and southeastern boroughs formed by the Spree, Havel, and Dahme rivers (the largest of which is Lake Müggelsee).',
//     'uploads/46.91546572021903Berlin.jpg', '2019-03-06', '2019-03-28', '233', '0'),
//     ('London', 'London is considered to be one of the worlds most important global cities[18][19][20] and has been termed the worlds most powerful,[21] most desirable,[22] most influential,[23] most visited,[24] most expensive,[25][26] innovative,[27] sustainable,[28] most investment friendly,[29] most popular for work,[30] and the most vegetarian friendly[31] city in the world.',
//     'uploads/30.471527647039554London.jpg', '2019-03-06', '2019-03-28', '233', '0'),
//     ('Miami', 'Miami, officially the City of Miami, is the cultural, economic and financial center of South Florida. Miami is the seat of Miami-Dade County, the most populous county in Florida. The city covers an area of about 56.6 square miles (147 km2), between the Everglades to the west and Biscayne Bay on the east',
//     'uploads/57.13005836782632Miami.jpg', '2019-03-06', '2019-03-28', '233', '0'),
//     ('Amsterdam', 'Amsterdam is the capital city and most populous municipality of the Netherlands. Its status as the capital is mandated by the Constitution of the Netherlands,[12] although it is not the seat of the government, which is The Hague.',
//     'uploads/74.93854172223595Amsterdam.jpg', '2019-03-06', '2019-03-28', '233', '0'),
//     ('New York', 'The City of New York, usually called either New York City (NYC) or simply New York (NY), is the most populous city in the United States and thus also in the state of New York.[11] With an estimated 2017 population of 8,622,698[7] distributed over a land area of about 302.6 square miles (784 km2),[12][13] New York is also the most densely populated major city in the United States.',
//     'uploads/38.74260537088323NewYork.jpg', '2019-03-06', '2019-03-28', '233', '0');`;
//     await pool.query(addVacations);


//     res.send("DB and table created and Admin register to the system");
//   }
//   catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
