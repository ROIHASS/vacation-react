var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var fs = require('fs');
var socketServer = require('../utils/socketHelper');

pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'vacationDB',
  connectionLimit: 10
});





/*here chekes if user loged in*/ //done!
router.get('/isUserLogin', async function (req, res) {
  if (req.session.UserConnect === true) {
    res.send(true)
  }
  else {
    res.send(false)
  }
});

router.get('/isAdmin', async function (req, res) {
  if (req.session.isAdmin === true) {
    res.send({ switch: 'AdminHomepage' })
  }
  else {
    res.send({ switch: 'UserHompage' })
  }
});


/*Here user login*/ //done!
router.post('/Login', async function (req, res, next) {
  let Login = `
    SELECT * FROM Users
    WHERE UserName = '${req.body.UserName}' AND PASS = '${req.body.Password}';
    `
  let resp = await pool.query(Login);
  if (resp.length > 0 || req.session.UserConnect === true) {
    req.session.isAdmin = false
    if (resp[0].Permission === 'admin') {
      req.session.isAdmin = true
    }
    req.session.identify = resp[0].id
    req.session.UserConnect = true
    res.send(resp)
  }
  else {
    res.send({ wrong: 'worng Username or Password' })
  }
});


/*Here user register*/ //done!
router.post('/Register', async function (req, res, next) {
  let LoadUserName = `
  SELECT * FROM Users
  WHERE UserName = '${req.body.UserName}';
  `
  let resp = await pool.query(LoadUserName);
  if (resp.length > 0) {
    res.send({ wrong: "That username is taken. Try another" })
  }
  else {
    var Register = `
    INSERT INTO Users (FirstName, LastName, UserName, Pass, Permission, Vacations)
    VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${req.body.UserName}', '${req.body.Password}', '0', '[]');
   `;
    let resp2 = await pool.query(Register);
    if (resp2.affectedRows > 0)
      req.session.identify = resp2.insertId
    req.session.UserConnect = true
    res.send({ done: 'Register complite' })
  }
});

/*Here user logout*/ //done !
router.get('/Logout', async function (req, res, next) {
  req.session.destroy(err => console.log(err))
  res.send({ log: 'loged out' })
});

/*Here user LoadUser*/ //done !
router.get('/LoadUser', async function (req, res, next) {
  if (req.session.UserConnect === true) {
    let LoadVacation = `  
  SELECT UserName FROM Users
  WHERE id = '${req.session.identify}'`
    let resp = await pool.query(LoadVacation);
    res.send(resp)
  }
  else res.send({ wrong: 'somthing wrong happend' })
});

/*Here all vacation loading to component*/ //done!
router.get('/LoadVacation', async function (req, res, next) {
  if (req.session.UserConnect === true) {
    let LoadUserVacation = `
  SELECT Vacations FROM Users
  WHERE id = '${req.session.identify}'
  `
    let resp = await pool.query(LoadUserVacation);
    let UserVacationArray = JSON.parse(resp[0].Vacations)

    let LoadVacation = `
  SELECT * FROM Vacation;
  `
    let resp2 = await pool.query(LoadVacation);
    let arr = []
    let UserArr = []
    resp2.forEach(r => {
      let boole = false
      UserVacationArray.forEach(i => {
        if (r.id == i) {
          r.checked = 'checked'
          UserArr.push(r)
          boole = true
        }
      })
      if (boole == false) {
        r.checked = ''
        arr.push(r)
      }
    })
    let ArrayToSend = UserArr.concat(arr)
    res.send(ArrayToSend)
  }
  else res.send({ wrong: 'somthing wrong happend' })
});


/*Here user start follow on vacation*/ //done!
router.post('/StartFollow', async function (req, res, next) {
  if (req.session.UserConnect === true) {
    let LoadVacation = `  
  SELECT Vacations FROM Users
  WHERE id = '${req.session.identify}'`
    let resp = await pool.query(LoadVacation);
    let arr = resp[0].Vacations
    arr = JSON.parse(arr)
    arr.push(req.body.id)
    let UpdateVacation = `
  UPDATE Users
  SET Vacations = '[${arr}]'
  WHERE id = '${req.session.identify}';
  `
    await pool.query(UpdateVacation);
    let addFolower = `
  SELECT Followers FROM vacation
  WHERE id = '${req.body.id}'
  `
    let respAddFolower = await pool.query(addFolower);
    let num = respAddFolower[0].Followers * 1 + 1;
    let updateFolower = `
  UPDATE vacation
  SET Followers = '${num}'
  WHERE id = '${req.body.id}';
  `
    await pool.query(updateFolower);
    res.send('got')
  }
  else res.send({ wrong: 'somthing wrong happend' })
});

/*Here user end follow on vacation*/ //done!
router.post('/EndFollow', async function (req, res, next) {
  if (req.session.UserConnect === true) {
    let LoadVacation = `  
  SELECT Vacations FROM Users
  WHERE id = '${req.session.identify}'`
    let resp = await pool.query(LoadVacation);
    let arr = resp[0].Vacations
    arr = JSON.parse(arr)
    arr.forEach((r, i) => {
      if (r == req.body.id) {
        arr.splice(i, 1)
      }
    });

    let UpdateVacation = `
  UPDATE Users
  SET Vacations = '[${arr}]'
  WHERE id = '${req.session.identify}';
  `
    await pool.query(UpdateVacation);

    let removeFolower = `
  SELECT Followers FROM vacation
  WHERE id = '${req.body.id}'
  `
    let respAddFolower = await pool.query(removeFolower);
    let num = respAddFolower[0].Followers * 1 - 1;
    let updateFolower = `
  UPDATE vacation
  SET Followers = '${num}'
  WHERE id = '${req.body.id}';
  `
    await pool.query(updateFolower);
    res.send('got')
  }
  else res.send({ wrong: 'somthing wrong happend' })
});






/*Here admin can update vacation*/ //done!
router.put('/UpdateVacation', async function (req, res, next) {
  if (req.session.isAdmin === true) {
    let random = Math.random(1) * 10;
    let relativePath;
    let requst = JSON.parse(req.body.state)
    if (req.files) {
      relativePath = 'uploads/' + random + req.files.foo.name
      req.files.foo.mv('public\\uploads\\' + random + req.files.foo.name)
      let path = 'public/' + requst.Image;
      fs.unlink(path, (err) => {
        console.log(err)
      });
    }
    else {
      relativePath = requst.Image;
    }

    let UpdateVacation = `
  UPDATE Vacation
  SET Description = '${requst.Description}', Destination = '${requst.Destination}',
  Image = '${relativePath}', StartDate = '${requst.StartDate}',
  EndDate =  '${requst.EndDate}', Price = '${requst.Price}'
  WHERE id = '${requst.id}';
  `
    let resp = await pool.query(UpdateVacation);
    socketServer.ioServer.emit('reload', "Vacation updated");
    res.send(resp)

  }
  else res.send({ wrong: 'somthing wrong happend' })
});





/*Here admin can delete vacation*/ //done!
router.delete('/DeleteVacation', async function (req, res, next) {
  if (req.session.isAdmin === true) {
    let path = 'public/' + req.body.Image
    fs.unlink(path, (err) => {
      console.log(err)
    });

    let DeleteVacation = `
  DELETE FROM Vacation
  WHERE id = '${req.body.id}';
  `;
    let resp = await pool.query(DeleteVacation);

    let deleteFromUser = `
    SELECT id, Vacations FROM Users
    `
    let result = await pool.query(deleteFromUser);
    result.forEach(r => {
      let arr = JSON.parse(r.Vacations)
      arr.forEach(async (x, i) => {
        if (x == req.body.id) {
          arr.splice(i, 1)
          let UpdateVacation = `
          UPDATE Users
          SET Vacations = '[${arr}]'
          WHERE id = '${r.id}';
          `
          await pool.query(UpdateVacation);
        }
      })
    })
    socketServer.ioServer.emit('reload', "Vacation Removed");
    res.send(resp)
  }
  else res.send({ wrong: 'somthing wrong happend' })
});



/*Here admin can add vacation*/ //done!
router.post('/addVacation', async function (req, res, next) {
  if (req.session.isAdmin === true) {
    let random = Math.random(1) * 100
    let relativePath = 'uploads/' + random + req.files.foo.name
    req.files.foo.mv('public\\uploads\\' + random + req.files.foo.name)
    let requst = JSON.parse(req.body.state)
    var addVacation = `
  INSERT INTO vacation (Description, Destination, Image, StartDate, EndDate, Price, Followers)
  VALUES ('${requst.Description}','${requst.Destination}','${relativePath}',
  '${requst.StartDate}', '${requst.EndDate}', '${requst.Price}', '0');
 `;
    let resp = await pool.query(addVacation);
    socketServer.ioServer.emit('reload', "Vacation added");
    res.send(resp)
  }
  else res.send({ wrong: 'somthing wrong happend' })
});




/*Create DB and Tabals*/
/*
router.get('/createDB', async function (req, res, next) {
  try {
    await pool.query("CREATE DATABASE vacationDB");
    //here we already have db lets create table
    let creatTableQuery = `
      CREATE TABLE vacationDB.Users (
      id INT NOT NULL AUTO_INCREMENT,
      FirstName VARCHAR(45) NOT NULL,
      LastName VARCHAR(45) NOT NULL,
      UserName VARCHAR(45) NOT NULL,
      Pass VARCHAR(45) NOT NULL,
      Permission VARCHAR(45) NOT NULL,
      Vacations VARCHAR(45) NOT NULL,
      PRIMARY KEY (id))  `;
    await pool.query(creatTableQuery);

    let vacation = `
      CREATE TABLE vacationDB.Vacation (
      id INT NOT NULL AUTO_INCREMENT,
      Destination VARCHAR(45) NOT NULL,
      Description VARCHAR(500) NOT NULL,
      Image VARCHAR(100) NOT NULL,
      StartDate VARCHAR(45) NOT NULL,
      EndDate VARCHAR(45) NOT NULL,
      Price VARCHAR(45) NOT NULL,
      Followers VARCHAR(45) NOT NULL,
      PRIMARY KEY (id))  `;
    await pool.query(vacation);

    let Register = `
    INSERT INTO vacationDB.Users (FirstName, LastName, UserName, Pass, Permission, Vacations)
    VALUES ('Admin', 'Admin', 'admin', 'admin', 'admin', '[]');
   `;
    await pool.query(Register);

    res.send("DB and table created and Admin register to the system");
  }
  catch (err) {
    console.log(err);
  }
});
*/
module.exports = router;
