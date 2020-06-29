const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res) => {
    res.render('links/add');
})
// AGREGA TEMAS A LA BDD
router.post('/add',isLoggedIn, async(req, res) => {
    const { title, description } = req.body;
    const newTema = {
        title,
        description,
        user_id: req.user.id
    }
    await pool.query('INSERT INTO temas set ?', [newTema]);
    req.flash('success', 'Tema saved successfully');
    res.redirect('/links');
});

// LISTAR LOS TEMAS
router.get('/', isLoggedIn, async(req, res) => {
    const linksTemas = await pool.query('SELECT * FROM temas WHERE user_id = ?' , [req.user.id]);
    res.render('links/list', { linksTemas });
});

// DELETE
router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM temas WHERE ID = ?', [id]);
    req.flash('success', 'Tema eliminado correctamente');
    res.redirect('/links');
});

// OBTENGO ELEMENTOS A EDITAR
router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const temas = await pool.query('SELECT * FROM temas WHERE ID = ?', [id]);
    res.render('links/edit', {tema: temas[0]});
});

// ENVIO LAS MODIFICACIONES
router.post('/edit/:id',isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const temaModif = {
        title,
        description
    }
    await pool.query('UPDATE temas set ? WHERE id = ?', [temaModif, id]);
    req.flash('success', 'Los cambios se actualizaron correctamente');
    res.redirect('/links');
});



module.exports = router;