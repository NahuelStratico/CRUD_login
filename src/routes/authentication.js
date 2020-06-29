const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// Rederizado de formulario
router.get('/signup',isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

// Enviando el user 
router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/perfil',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next)
});

// Enviar datos de formulario
router.post('/signup',isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/perfil',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Ruta Login
router.get('/signin',isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});


// Ruta Perfil
router.get('/perfil', isLoggedIn,(req, res) => {
    res.render('perfil');
});

// Cerrar Sesion
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});


module.exports = router;