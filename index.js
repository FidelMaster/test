const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Creating the Express server
const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

// Connection to the SQlite database
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database("./apptest.db", err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'apptest.db'");
});

// Creating the Books table (Book_ID, Title, Author, Comments)
const sql_create = `CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  correo VARCHAR(100) NOT NULL,
  clave VARCHAR(100) NOT NULL
);`;
db.run(sql_create, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'Books' table");
});


// Server configuration
app.set('port', process.env.PORT || 4000);

// Starting the server
app.listen(
    app.get('port'), () => {
        console.log('Server is in port', app.get('port'));
    });

// GET /
app.get("/autenticacion", (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});


app.get("/encuesta", (req, res) => {
  
    res.sendFile(__dirname + '/public/pregunta.html');
});
app.get("/encuestafinal", (req, res) => {
  
    res.sendFile(__dirname + '/public/fin.html');
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/encuesta.html');
});

app.get("/registros", (req, res) => {
    res.sendFile(__dirname + '/public/registros.html');
});

app.get("/registros/json", (req, res) => {
    const sql = "SELECT * FROM user"
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.status(200).json(rows);
          });
});



// POST /create
app.post("/good", (req, res) => {
    const sql = "INSERT INTO user (correo, clave) VALUES (?, ?)";
    const book = [req.body.correo, req.body.clave];
    db.run(sql, book, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/encuesta");
    });
  });

// GET /data
