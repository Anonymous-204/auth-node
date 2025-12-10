const authRequired = require('../middleware/auth');
const auth = require('../controllers/authController');
function router(app) {
    app.get('/',authRequired, (req, res) => res.render('home'));
    app.get('/login', (req, res) => res.render('login'));
    app.get('/register', (req, res) => res.render('register'));
    app.use('/api', auth);
}
    
module.exports = router;