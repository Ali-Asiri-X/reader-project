const express = require('express');
const path = require('path');
const rti = require('rticonnextdds-connector');
const app = express();
const configFile = path.join(__dirname, 'ShapeExample.xml');

const data = []; // Moved outside the function to ensure it is accessible

const run = async () => {
  const connector = new rti.Connector('MyParticipantLibrary::MySubParticipant', configFile);
  const input = connector.getInput('MySubscriber::MySquareReader');
  try {
    console.log('Waiting for publications...');
    await input.waitForPublications();

    console.log('Waiting for data...');
    for (let i = 0; i < 500; i++) {
      await input.wait();
      input.take();
      for (const sample of input.samples.validDataIter) {
        const jsonData = sample.getJson();
        data.push({
          x: jsonData.x,
          y: jsonData.y,
          shapesize: jsonData.shapesize,
          color: jsonData.color
        });
      }
    }
  } catch (err) {
    console.log('Error encountered: ' + err);
  }
  connector.close();
};

// Define the API route outside the run function
app.get('/api', (req, res) => {
  res.json(data);
});

app.listen(5001, async () => {
  console.log("Server started on port 5001");
  await run();
});