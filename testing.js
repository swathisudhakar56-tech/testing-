// vulnerable_app.js
const express = require('express');
const { exec } = require('child_process');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Hardcoded secret (bad practice)
const SECRET_KEY = "supersecret123";

// Insecure SQL query (SQL Injection vulnerability)
app.get('/user', (req, res) => {
  const userId = req.query.id; 
  const connection = mysql.createConnection({host:'localhost', user:'root', password:'', database:'test'});
  
  // Directly concatenating user input into SQL query (HIGH RISK)
  connection.query("SELECT * FROM users WHERE id = " + userId, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command injection vulnerability
app.get('/ping', (req, res) => {
  const host = req.query.host;
  // User-controlled input passed to exec (HIGH RISK)
  exec("ping -c 1 " + host, (err, stdout, stderr) => {
    if (err) {
      res.send(stderr);
      return;
    }
    res.send(stdout);
  });
});

// Unsafe eval usage
app.post('/eval', (req, res) => {
  const code = req.body.code;
  // Direct eval of user input (EXTREMELY DANGEROUS)
  const result = eval(code);
  res.send("Result: " + result);
});

app.listen(3000, () => {
  console.log('Vulnerable app listening on port 3000');
});
