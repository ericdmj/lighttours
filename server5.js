const express = require('express');
const bodyParser = require('body-parser');
const { BigQuery } = require('@google-cloud/bigquery');
// Creates a BigQuery client
const bigquery = new BigQuery({
    // The relative file path to your Service Account key file
    keyFilename: 'ejlighttours-8c90583a6fc2.json',
    // The GCP project ID we want to work in
    projectId: 'ejlighttours'
});

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the form
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <label for="Address">Address:</label>
      <input type="text" id="Address" name="Address" required>
      <br>
      <label for="DisplayType">Display Type:</label>
      <input type="text" id="DisplayType" name="DisplayType" required>
      <br>
      <label for="LocationType">Location Type:</label>
      <input type="text" id="LocationType" name="LocationType">
      <br>
      <label for="LightCount">Light Count:</label>
      <input type="number" id="LightCount" name="LightCount">
      <br>
      <label for="Inflatables">Inflatables:</label>
      <input type="radio" id="Infltrue" name="Inflatables" value="true">
        <label for="Infltrue">Yes</label> 
      <input type="radio" id="Inflfalse" name="Inflatables" value="false">
        <label for="Inflfalse">No</label><br>
      <label for="Animated">Animated:</label>
      <input type="radio" id="Animtrue" name="Animated" value="true">
        <label for="Animtrue">Yes</label> 
      <input type="radio" id="Animfalse" name="Animated" value="false">
        <label for="Animfalse">No</label><br>
      <label for="Music">Music:</label>
      <input type="radio" id="Musitrue" name="Music" value="true">
        <label for="Musitrue">Yes</label> 
      <input type="radio" id="Musifalse" name="Music" value="false">
        <label for="Musifalse">No</label><br>
      <label for="Traditional">Traditional decor:</label>
      <input type="radio" id="Tradtrue" name="Traditional" value="true">
        <label for="Tradtrue">Yes</label> 
      <input type="radio" id="Tradfalse" name="Traditional" value="false">
        <label for="Tradfalse">No</label><br>
      <label for="Notes">Other Notes:</label>
      <input type="text" id="Notes" name="Notes">
      <br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { Address, DisplayType, LocationType, LightCount, Inflatables, Animated, Music, Traditional, Notes } = req.body;

  // Validate inputs
  if (!Address || !DisplayType) {
    return res.status(400).send('Both address and display type are required');
  }

  // Prepare row data
  const rows = [
    { Address: Address, DisplayType: DisplayType, LocationType: LocationType, LightCount: LightCount, Inflatables: Inflatables, Animated: Animated, Music: Music, Traditional: Traditional, Notes: Notes } // Parse age to integer
  ];

  try {
    // Insert data into BigQuery
    const datasetId = 'my_test_dataset';
    const tableId = 'locations';
    await bigquery.dataset(datasetId).table(tableId).insert(rows);

    res.send(`Successfully inserted: ${Address}, Display type: ${DisplayType}, and more`);
  } catch (error) {
    console.error('Error inserting rows:', error);
    res.status(500).send('Error inserting rows into BigQuery');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});