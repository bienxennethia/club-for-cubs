const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const routes = require('./db/routes');
app.use('/', urlencodedParser, routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
