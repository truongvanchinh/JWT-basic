const express = require('express');
const app = express();
const initAPI = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initAPI(app);

let port = process.env.PORT || 8017;

app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
})
