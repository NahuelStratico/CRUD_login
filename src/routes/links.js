const express = require('express');
const router = express.Router();

const pool = require('../database')

router.get('/add', (req, res) => {
    res.render('links/add');
})
// AGREGA TEMAS A LA BDD
router.post('/add', async(req, res) => {
    const { title, description } = req.body;
    const newTema = {
        title,
        description
    }
    await pool.query('INSERT INTO temas set ?', [newTema]);
    req.flash('success', 'Tema saved successfully');
    res.redirect('/links');
});

// LISTAR LOS TEMAS
router.get('/', async(req, res) => {
    const linksTemas = await pool.query('SELECT * FROM temas');
    res.render('links/list', { linksTemas });
});

// DELETE
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM temas WHERE ID = ?', [id]);
    req.flash('success', 'Tema eliminado correctamente');
    res.redirect('/links');
});

// OBTENGO ELEMENTOS A EDITAR
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const temas = await pool.query('SELECT * FROM temas WHERE ID = ?', [id]);
    res.render('links/edit', {tema: temas[0]});
});

// ENVIO LAS MODIFICACIONES
router.post('/edit/:id', async (req,res) => {
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