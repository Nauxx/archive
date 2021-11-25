const express = require('express');
const app = express();
const WebSocket = require('ws');

const axios = require('axios');
const xml2js = require('xml2js');

const serverPort = 8000;
const wssPort = 8080;

const wss = new WebSocket.Server({ port: wssPort });

wss.on('connection', (ws) => {
  console.log('client connected');

  ws.on('message', (data) => {
    axios
      .get(data.toString())
      .then((response) => {
        xml2js.parseString(response.data, (err, result) => {
          const locList = result.urlset.url.map((set) => set.loc[0]);

          locList.forEach((element, index, array) => {
            setTimeout(function () {
              /* post data to  https://web.archive.org/save/$element */
              ws.send(`saving url ${index + 1} of ${array.length}: ${element}`);
            }, index * 300);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ws.on('close', () => {
    console.log('client disconnected');
  });
});

app.use(express.static('public'));

app.listen(serverPort, () => {
  console.log(`listening on port 8000`);
});

/* const getXmlAndPostToArchive = async () => {
      try {
        const response = await axios.get(data.toString());
        xml2js.parseString(response.data, (err, result) => {
          const locList = result.urlset.url.map((set) => set.loc[0]);

          locList.forEach((element, index, array) => {
            setTimeout(function () {
              post data to  https://web.archive.org/save/$element
              ws.send(`saving url ${index + 1} of ${array.length}: ${element}`);
            }, index * 300);
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
    getXmlAndPostToArchive(); */
