import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// GET /events — lista todos os eventos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events ORDER BY event_date ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// GET /events/:id — busca evento por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// POST /events — cria novo evento
router.post('/', async (req, res) => {
  const { name, description, venue, city, event_date, category, total_tickets, price } = req.body;

  if (!name || !venue || !city || !event_date || !total_tickets || !price) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO events (name, description, venue, city, event_date, category, total_tickets, available_tickets, price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, venue, city, event_date, category, total_tickets, total_tickets, price]
    );
    res.status(201).json({ id: result.insertId, message: 'Evento criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// PUT /events/:id — atualiza evento
router.put('/:id', async (req, res) => {
  const { name, description, venue, city, event_date, category, total_tickets, price } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE events SET name=?, description=?, venue=?, city=?, event_date=?, category=?, total_tickets=?, price=?
       WHERE id=?`,
      [name, description, venue, city, event_date, category, total_tickets, price, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ message: 'Evento atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// DELETE /events/:id — remove evento
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

export default router;
