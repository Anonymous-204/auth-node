const express = require('express');
const app = express();
const path = require('path');
const route = require('./routes');
const auth = require('./controllers/authController');
const connect = require('./config/db');
connect();

const hbs = require('express-handlebars');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// middleware
app.use(cors());
app.use(express.json());

// đăng ký handlebars
app.engine('hbs', hbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', 'hbs');

// CHỈ CẦN THƯ MỤC views, KHÔNG ĐƯỢC THÊM layouts
app.set('views', path.join(__dirname, 'views'));

route(app);
console.log('views path:', path.join(__dirname, 'views'));

const port = process.env.PORT || 3000;
app.use('/api', auth);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


