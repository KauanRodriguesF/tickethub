-- Script de criação do banco de dados TicketHub
-- Rodar este arquivo no RDS MySQL/PostgreSQL

CREATE DATABASE IF NOT EXISTS tickethub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tickethub;

CREATE TABLE IF NOT EXISTS events (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(200)   NOT NULL,
  description       TEXT,
  venue             VARCHAR(200)   NOT NULL,
  city              VARCHAR(100)   NOT NULL,
  event_date        DATETIME       NOT NULL,
  category          ENUM('show', 'sports', 'festival', 'theater', 'other') DEFAULT 'other',
  total_tickets     INT            NOT NULL,
  available_tickets INT            NOT NULL,
  price             DECIMAL(10,2)  NOT NULL,
  created_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dados de exemplo para testes
INSERT INTO events (name, description, venue, city, event_date, category, total_tickets, available_tickets, price) VALUES
('Lollapalooza Brasil 2026',  'Festival de música com atrações internacionais', 'Autódromo de Interlagos', 'São Paulo',   '2026-03-27 12:00:00', 'festival', 60000, 60000, 450.00),
('Flamengo x Palmeiras',      'Clássico do futebol brasileiro - Campeonato Brasileiro', 'Maracanã', 'Rio de Janeiro',     '2026-06-15 16:00:00', 'sports',  78000, 78000, 120.00),
('Show Ed Sheeran',           'Mathematics Tour - Show solo acústico e completo',        'Allianz Parque',  'São Paulo',   '2026-07-20 20:00:00', 'show',    43000, 43000, 380.00),
('Rock in Rio 2026',          'O maior festival de música do mundo',                     'Cidade do Rock',  'Rio de Janeiro','2026-09-12 14:00:00','festival',100000,100000, 600.00),
('Corinthians x São Paulo',   'Derby Paulista - Campeonato Paulista',                    'Neo Química Arena','São Paulo',  '2026-05-30 19:00:00', 'sports',  48000, 48000,  90.00);
