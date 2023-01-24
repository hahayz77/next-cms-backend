const express = require('express');
var cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const port = 3000;


//App Routes ####################
app.use('/image', require('./routes/image'));

app.get('/', (req, res)=> res.json({response: "Backend for NextJS CMS"}));


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
});