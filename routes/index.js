var express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
    console.log(req.user.name.givenName);
    res.render('dashboard', { title: 'Dashboard', user: req.user });
  })

  router.get('/auth/failure', function(req, res, next) {
    res.status(err.status || 500);
    res.render('error');
  })

  router.get('/auth/openid', 
  passport.authenticate('azuread-openidconnect', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/failure',
    failureFlash : true
  }),
  function(req, res) {
    console.log('Login Successful - /auth/openid');
    res.redirect('/dashboard');
  });

  // 'GET returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // query (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.

  router.get('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Login Successful - GET /auth/openid/return');
    res.redirect('/');
  });

  // 'POST returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // body (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.

  router.post('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Login Successful - POST /auth/openid/return');
    res.redirect('/dashboard');
  });

  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
  }

  return router;
}
