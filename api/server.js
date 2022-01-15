const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { options, getCandidateList, getProgs } = require('./datainit');

app.use(cors(options));
app.use(express.json());

app.get('/api/grades', function(req, res) {
  fs.readFile(path.resolve(__dirname, './data/catares-grades.json'), function(err, data) {
    if (err) {
      res.send({});
    }
    res.send(JSON.parse(data));
  });
});

app.post('/api/grades', function(req, res) {
  fs.writeFile(
    path.resolve(__dirname, './data/catares-grades.json'),
    JSON.stringify(req.body),
    function(err, data) {
      if (err) {
        res.send('');
      }
      res.send('Grades file updated successfully.');
    }
  );
});

app.get('/api/results/:candidate', function(req, res) {
  fs.readFile(path.resolve(__dirname, './data/catares-results.json'), function(err, data) {
    if (err) {
      res.send('');
    }
    res.send(JSON.parse(data)[req.params.candidate] || []);
  });
});

app.delete('/api/results/:candidate', function(req, res) {
  fs.readFile(path.resolve(__dirname, './data/catares-results.json'), function(err, data) {
    let results = JSON.parse(data);
    delete results[req.params.candidate];

    fs.writeFile(
      path.resolve(__dirname, './data/catares-results.json'),
      JSON.stringify(results),
      function(err) {
        if (err) {
          res.send({});
        }
        getCandidateList(req, res);
      }
    );
  });
});

app.get('/api/candidates/:prog', function(req, res) {
  getCandidateList(req, res);
});

app.post('/api/results/:candidate', function(req, res) {
  fs.readFile(path.resolve(__dirname, './data/catares-results.json'), function(err, data) {
    let results = JSON.parse(data);
    delete results[req.params.candidate];
    results[req.params.candidate] = req.body;

    fs.writeFile(
      path.resolve(__dirname, './data/catares-results.json'),
      JSON.stringify(results),
      function(err) {
        if (err) {
          res.send('');
        }
        res.send('Results file updated successfully.');
      }
    );
  });
});

app.get('/api/progs/:code', async function(req, res) {
  const progs = await getProgs();
  if (progs.some((p) => p.toLowerCase() === req.params.code)) {
    fs.readFile(path.resolve(__dirname, `./data/catares-${req.params.code}.json`), function(
      err,
      data
    ) {
      if (err) {
        res.send({});
        return;
      }
      res.send(JSON.parse(data));
    });
  } else {
    res.send({});
  }
});

app.post('/api/progs/:code', async function(req, res) {
  const progs = await getProgs();
  if (progs.some((p) => p.toLowerCase() === req.params.code)) {
    fs.writeFile(
      path.resolve(__dirname, `./data/catares-${req.params.code}.json`),
      JSON.stringify(req.body),
      function(err, data) {
        if (err) {
          res.send('');
        }
        res.send(`Prog file: ###-${req.params.code} updated successfully`);
      }
    );
  }
});

app.listen(3000, function() {
  console.log('Server running locally on port 3000.');
});
