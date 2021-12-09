const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const options = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://ec2-3-140-49-1.us-east-2.compute.amazonaws.com'
    : 'http://localhost:8081',
  optionSuccessStatus: 200,
};

app.use(cors(options));

app.use(express.json());

app.get('/api/grades', function (req, res) {
  fs.readFile(path.join(__dirname, '/data/catares-grades.json'), function (err, data) {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

app.post('/api/grades', function (req, res) {
  fs.writeFile(path.join(__dirname, '/data/catares-grades.json'), JSON.stringify(req.body), function (err, data) {
    if (err) {
      throw err;
    }
    res.send('Grades file updated successfully.');
  });

});

app.get('/api/results', function (req, res) {
  fs.readFile(path.join(__dirname, '/data/catares-results.json'), function (err, data) {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

app.post('/api/results', function (req, res) {

  fs.writeFile(path.join(__dirname, '/data/catares-results.json'), JSON.stringify(req.body), function (err, data) {
    if (err) {
      throw err;
    }
    res.send('Results file updated successfully.');
  });

});

const progs = [
  'ACCHFT',
  'ACCHPT',
  'ACCNFT',
  'ACCNPT',
  'QUSHFT',
  'QUSHPT',
  'QUSNFT',
  'QUSNPT'];

app.get('/api/progs/:code', function (req, res) {
  if (progs.some(p => p.toLowerCase() == req.params.code)) {
    fs.readFile(path.join(__dirname, `/data/catares-${req.params.code}.json`), function (err, data) {
      if (err) {
        res.send('');
        throw err;
      }
      res.send(JSON.parse(data));
    });
  } else {
    res.send('');
  }

});

app.post('/api/progs/:code', function (req, res) {
  if (progs.some(p => p.toLowerCase() == req.params.code)) {
    fs.writeFile(path.join(__dirname, `/data/catares-${req.params.code}.json`), JSON.stringify(req.body), function (err, data) {
      if (err) {
        throw err;
      }
      res.send(`Prog file: ###-${req.params.code} updated successfully`);
    });
  }
});

app.listen(3000, function () {
  console.log('Application is running on port 3000.');
});
