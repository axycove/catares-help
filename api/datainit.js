const fs = require('fs')
const path = require('path')

module.exports = {
  options: {
    origin: process.env.NODE_ENV === 'production'
      ? 'http://ec2-3-140-49-1.us-east-2.compute.amazonaws.com'
      : 'http://localhost:8081',
    optionSuccessStatus: 200,
  },

  getCandidateList(req, res) {
    const array = []
    fs.readFile(path.resolve(__dirname, './data/catares-results.json'), function (err, data) {
      if (err) {
        throw err;
      }
      data = data ? JSON.parse(data) : null
      const filter = req.params.candidate ? req.params.candidate.split('$')[1] : req.params.prog
      if (data) {
        const resKeys = Object.keys(data)
        let i = 0
        resKeys.forEach(rk => {
          if (rk.split('$')[1] === filter) {
            let datasets = data[rk].map(ds => ds.description)
            array.push({
              id: ++i,
              name: rk,
              datasets: datasets.join(', ')
            })
          }

        })
      }
      res.send(array)
    });

  },

  progs: [
    'ABENFT',
    'ABEHFT',
    'ACCNFT',
    'ACCNPT',
    'ACCHFT',
    'ACCHPT',
    'CEGNFT',
    'CEGHFT',
    'EEENFT',
    'EEEHFT',
    'QUSNFT',
    'QUSNPT',
    'QUSHFT',
    'QUSHPT',
  ],

  // getProgs() {
  //   let progs = []

  //   fs.readdir(path.resolve(__dirname, './data/'), await function (err, files) {
  //     files.forEach(file => {
  //       if (!['grades', 'results'].some(item => file.indexOf(item) > -1)) {
  //         progs.push(file.toUpperCase().split('-')[1].split('.')[0])
  //       }
  //     })
  //   })  
  // }
}
