const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const PORT = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router for all files 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/LogSucess", (req, res) => {
  res.sendFile(__dirname + "/public/LogSucess.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/User_already", (req, res) => {
  res.sendFile(__dirname + "/public/User_already.html");
});
app.get("/wrongDetail", (req, res) => {
  res.sendFile(__dirname + "/public/wrongDetail.html");
});
app.get("/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/styles.css");
});
//logout
app.get("/logout", function (req, res) {
  res.redirect("/");
});


//user login post request 
app.post("/login", function (req, res) {
  const { email, password } = req.body;
  getAllusers(function (error, users) {
    if (error) {
      res.render("login", { error: error });
    } else {
      const match = users.find(function (user) {
        return user.email === email;
      });
      if (match === undefined) {
        res.send("User not registered ");
      } else {
        if (match.email === email && match.password === password) {
          res.sendFile(__dirname + "/public/Logsucess.html");
        } else {
          res.sendFile(__dirname + "/public/wrongDetail.html");
        }
      }
    }
  });
});

//post signup
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const user = {
    username: username,
    email: email,
    password: password,
  };

  //save entry in file
  saveUser(user, function (error, flag) {
    if (error) {
      res.render("signup", { error: error });
    } else if (flag === true) {
      res.sendFile(__dirname + "/public/User_already.html");
    } else {
      res.redirect("/login");
    }
  });
});

//server starts here 
app.listen(PORT, () => {
  console.log(`Server start at port ${PORT}`);
})

// get all user func
function getAllusers(callback) {
  fs.readFile("./Data.txt", "utf-8", function (error, data) {
    if (error) {
      callback(error);
    } else {
      if (data.length === 0) {
        data = "[]";
      }
      try {
        let users = JSON.parse(data);
        callback(null, users);
      } catch (error) {
        callback(null, []);
      }
    }
  });
}

//func save users
function saveUser(newuser, callback) {
  getAllusers(function (error, users) {
    if (error) {
      callback(error);
    } else {
      const user = users.find(function (user) {
        return user.email === newuser.email;
      });
      if (user) {
        callback(null, true);
      } else {
        users.push(newuser);

        fs.writeFile("./Data.txt", JSON.stringify(users), function (error) {
          if (error) {
            callback(error);
          } else {
            callback();
          }
        });
      }
    }
  });
}


