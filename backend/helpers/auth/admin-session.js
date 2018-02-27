/*
var auth = function(req, res, next) {
  if (!req.url.includes("shit.html")) {
    if (req.session && req.session.username && req.session.admin)
      return next();
    else if (req.session && req.session.username && !req.session.admin)
      return res.redirect('/admin/shit.html?status=403');
    else
      return res.redirect('/admin/shit.html?status=401');
  } else {
    return next();
  }
};

module.exports.auth = auth;

 app.use(session({
 secret: '1111-secret-Password1!',
 resave: true,
 saveUninitialized: true
 }));


// Login endpoint

 router.post('/login', function (req, res) {
 if (!req.body.username || !req.body.password) {
 return res.redirect('/admin/index.html');
 } else {
 if(req.body.username === "root") {
 User.findOne({ 'username': req.body.username }, function (err, response) {
 if (err) return res.redirect('/admin/index.html');
 if (response) {
 req.session.username = response.username;
 req.session.admin = response.admin;
 return res.redirect('/admin/index.html');
 }
 });
 } else {
 return res.redirect('/admin/index.html');
 }
 }
 });

 // Logout endpoint
 router.get('/logout', function (req, res) {
 req.session.destroy();
 res.send("logout success!");
 });
 */
