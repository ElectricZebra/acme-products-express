const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');
const FILE = path.join(__dirname, 'products.json')

const app = express();

const write = (filePath, data) => {
  return new Promise ((resolve, reject) => {
    if(!Array.isArray(data)) {
      return reject('data must be an array');
    }
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    })
  })
}

const read = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data)=> {
      if (err) {
        return reject(err)
      }
      let results;
      try {
        results = JSON.parse(data.toString());
        if(!Array.isArray(results)) {
          return reject('data must be an array');
        }
      }
      catch(ex) {
        return reject(ex);
      }
      resolve(results)
    })
  })
}

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

write(FILE, [{ name: 'foo' }, { name: 'bazz' }])
  .then(()=> read(FILE))
  .then (users => {
    users.push({ name: 'shep' });
    return write(FILE, users)
  })
  .catch(ex=> console.log(ex));

let serverData = [];

fs.readFile(FILE, (err, data) => {
  data.toString();
  serverData = data.toString();
  })

app.get('/api/data', (req, res, next)=> {
  res.send(serverData)
}
  );

app.listen(port, () => console.log(`listening on port ${port}`));
