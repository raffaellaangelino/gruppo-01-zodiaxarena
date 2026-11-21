-- =============================================================================
-- Dati di prova per il SAL (solo profilo dev, eseguito dopo data.sql a ogni avvio)
--
-- Ogni INSERT è protetto da NOT EXISTS: rieseguire lo script non duplica nulla.
-- Account e password: vedi "istruzioni backend.md".
--
--   Vega    (Leone, EFESTO)       2 mazzi validi + carte in più
--   Antares (Scorpione, POSEIDONE) 2 mazzi validi + carte in più
--   1 sfida PENDING: Vega -> Antares, con il mazzo "Cielo di Fuoco",
--   pronta per essere accettata da Antares.
--
-- Mazzi validi per l'engine: 7 creature, una per pianeta, da 1 a 3 per elemento,
-- tutte in Casa I, più un Ascendente.
-- =============================================================================

-- Vecchio account di test, senza giocatore: non serve più
DELETE FROM app_user
WHERE email = 'mail@example.com'
  AND id NOT IN (SELECT id FROM player);

-- -----------------------------------------------------------------------------
-- 1) Account (password cifrate con BCrypt, come fa la registrazione)
-- -----------------------------------------------------------------------------
INSERT INTO app_user (email, password_hash, role)
SELECT x.email, x.password_hash, 'USER'
FROM (
    SELECT 'vega@zodiax.test' AS email,
           '$2a$10$Q.OZIZDQK9UYz8JUUZet8uZREQBEFSPb7d3yWs7ztNgzHiAeujYiu' AS password_hash
    UNION ALL
    SELECT 'antares@zodiax.test',
           '$2a$10$kkhwixwtjs6Z.TOSSenSCO6hWRQ1m25FlGAQPj0/YG0Nr5SIuF/Vi'
) x
WHERE NOT EXISTS (SELECT 1 FROM app_user u WHERE u.email = x.email);

-- -----------------------------------------------------------------------------
-- 2) Giocatori: primi passi completati (onboarding_step NULL) e Fazione scelta
-- -----------------------------------------------------------------------------
INSERT INTO player (id, nick_name, credits, pity_counter, sun_sign_id, god, last_god_change, onboarding_step)
SELECT u.id, x.nick_name, x.credits, x.pity_counter, s.id, x.god, NOW(6), NULL
FROM (
    SELECT 'vega@zodiax.test' AS email, 'Vega' AS nick_name, 450 AS credits, 3 AS pity_counter,
           'Leone' AS sign_name, 'EFESTO' AS god
    UNION ALL
    SELECT 'antares@zodiax.test', 'Antares', 380, 6, 'Scorpione', 'POSEIDONE'
) x
JOIN app_user u ON u.email = x.email
JOIN sign s ON s.name = x.sign_name
WHERE NOT EXISTS (SELECT 1 FROM player p WHERE p.id = u.id)
  AND NOT EXISTS (SELECT 1 FROM player p WHERE p.nick_name = x.nick_name);

-- -----------------------------------------------------------------------------
-- Tabelle di appoggio (temporanee: lo script usa una sola connessione)
-- planet_name NULL = Ascendente del segno
-- -----------------------------------------------------------------------------
DROP TEMPORARY TABLE IF EXISTS seed_owned_card;
CREATE TEMPORARY TABLE seed_owned_card (
    email       VARCHAR(255) NOT NULL,
    planet_name VARCHAR(255) NULL,
    sign_name   VARCHAR(255) NOT NULL
);

INSERT INTO seed_owned_card (email, planet_name, sign_name) VALUES
    -- Vega: carte del "Cielo di Fuoco"
    ('vega@zodiax.test', 'Sole',     'Leone'),
    ('vega@zodiax.test', 'Luna',     'Toro'),
    ('vega@zodiax.test', 'Marte',    'Ariete'),
    ('vega@zodiax.test', 'Giove',    'Cancro'),
    ('vega@zodiax.test', 'Saturno',  'Gemelli'),
    ('vega@zodiax.test', 'Mercurio', 'Vergine'),
    ('vega@zodiax.test', 'Venere',   'Bilancia'),
    ('vega@zodiax.test', NULL,       'Leone'),
    -- Vega: carte della "Marea d'Agosto" (il Sole è la stessa copia)
    ('vega@zodiax.test', 'Luna',     'Pesci'),
    ('vega@zodiax.test', 'Marte',    'Sagittario'),
    ('vega@zodiax.test', 'Giove',    'Capricorno'),
    ('vega@zodiax.test', 'Saturno',  'Scorpione'),
    ('vega@zodiax.test', 'Mercurio', 'Acquario'),
    ('vega@zodiax.test', 'Venere',   'Toro'),
    ('vega@zodiax.test', NULL,       'Ariete'),
    -- Vega: carte in più (un doppione di Marte-Ariete)
    ('vega@zodiax.test', 'Marte',    'Ariete'),
    ('vega@zodiax.test', 'Venere',   'Gemelli'),
    ('vega@zodiax.test', 'Mercurio', 'Ariete'),
    ('vega@zodiax.test', 'Giove',    'Pesci'),
    ('vega@zodiax.test', 'Luna',     'Cancro'),
    -- Antares: carte dell'"Abisso"
    ('antares@zodiax.test', 'Sole',     'Scorpione'),
    ('antares@zodiax.test', 'Luna',     'Cancro'),
    ('antares@zodiax.test', 'Marte',    'Capricorno'),
    ('antares@zodiax.test', 'Giove',    'Leone'),
    ('antares@zodiax.test', 'Saturno',  'Acquario'),
    ('antares@zodiax.test', 'Mercurio', 'Gemelli'),
    ('antares@zodiax.test', 'Venere',   'Vergine'),
    ('antares@zodiax.test', NULL,       'Scorpione'),
    -- Antares: carte di "Terra e Vento" (il Sole è la stessa copia)
    ('antares@zodiax.test', 'Luna',     'Toro'),
    ('antares@zodiax.test', 'Marte',    'Bilancia'),
    ('antares@zodiax.test', 'Giove',    'Ariete'),
    ('antares@zodiax.test', 'Saturno',  'Pesci'),
    ('antares@zodiax.test', 'Mercurio', 'Capricorno'),
    ('antares@zodiax.test', 'Venere',   'Sagittario'),
    ('antares@zodiax.test', NULL,       'Toro'),
    -- Antares: carte in più (un doppione di Luna-Cancro)
    ('antares@zodiax.test', 'Luna',     'Cancro'),
    ('antares@zodiax.test', 'Marte',    'Leone'),
    ('antares@zodiax.test', 'Venere',   'Pesci'),
    ('antares@zodiax.test', 'Saturno',  'Vergine'),
    ('antares@zodiax.test', 'Mercurio', 'Leone');

DROP TEMPORARY TABLE IF EXISTS seed_deck_card;
CREATE TEMPORARY TABLE seed_deck_card (
    email       VARCHAR(255) NOT NULL,
    deck_name   VARCHAR(40)  NOT NULL,
    planet_name VARCHAR(255) NULL,
    sign_name   VARCHAR(255) NOT NULL
);

INSERT INTO seed_deck_card (email, deck_name, planet_name, sign_name) VALUES
    -- Fuoco 2 · Terra 2 · Aria 2 · Acqua 1
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Sole',     'Leone'),
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Luna',     'Toro'),
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Marte',    'Ariete'),
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Giove',    'Cancro'),
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Saturno',  'Gemelli'),
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Mercurio', 'Vergine'),
    ('vega@zodiax.test', 'Cielo di Fuoco', 'Venere',   'Bilancia'),
    ('vega@zodiax.test', 'Cielo di Fuoco', NULL,       'Leone'),
    -- Fuoco 2 · Acqua 2 · Terra 2 · Aria 1
    ('vega@zodiax.test', 'Marea d''Agosto', 'Sole',     'Leone'),
    ('vega@zodiax.test', 'Marea d''Agosto', 'Luna',     'Pesci'),
    ('vega@zodiax.test', 'Marea d''Agosto', 'Marte',    'Sagittario'),
    ('vega@zodiax.test', 'Marea d''Agosto', 'Giove',    'Capricorno'),
    ('vega@zodiax.test', 'Marea d''Agosto', 'Saturno',  'Scorpione'),
    ('vega@zodiax.test', 'Marea d''Agosto', 'Mercurio', 'Acquario'),
    ('vega@zodiax.test', 'Marea d''Agosto', 'Venere',   'Toro'),
    ('vega@zodiax.test', 'Marea d''Agosto', NULL,       'Ariete'),
    -- Acqua 2 · Terra 2 · Aria 2 · Fuoco 1
    ('antares@zodiax.test', 'Abisso', 'Sole',     'Scorpione'),
    ('antares@zodiax.test', 'Abisso', 'Luna',     'Cancro'),
    ('antares@zodiax.test', 'Abisso', 'Marte',    'Capricorno'),
    ('antares@zodiax.test', 'Abisso', 'Giove',    'Leone'),
    ('antares@zodiax.test', 'Abisso', 'Saturno',  'Acquario'),
    ('antares@zodiax.test', 'Abisso', 'Mercurio', 'Gemelli'),
    ('antares@zodiax.test', 'Abisso', 'Venere',   'Vergine'),
    ('antares@zodiax.test', 'Abisso', NULL,       'Scorpione'),
    -- Acqua 2 · Terra 2 · Fuoco 2 · Aria 1
    ('antares@zodiax.test', 'Terra e Vento', 'Sole',     'Scorpione'),
    ('antares@zodiax.test', 'Terra e Vento', 'Luna',     'Toro'),
    ('antares@zodiax.test', 'Terra e Vento', 'Marte',    'Bilancia'),
    ('antares@zodiax.test', 'Terra e Vento', 'Giove',    'Ariete'),
    ('antares@zodiax.test', 'Terra e Vento', 'Saturno',  'Pesci'),
    ('antares@zodiax.test', 'Terra e Vento', 'Mercurio', 'Capricorno'),
    ('antares@zodiax.test', 'Terra e Vento', 'Venere',   'Sagittario'),
    ('antares@zodiax.test', 'Terra e Vento', NULL,       'Toro');

-- -----------------------------------------------------------------------------
-- 3) Collezione: solo se il giocatore non ha ancora nessuna carta
-- -----------------------------------------------------------------------------
INSERT INTO player_card (player_id, card_definition_id)
SELECT p.id, cd.id
FROM seed_owned_card x
JOIN app_user u ON u.email = x.email
JOIN player p ON p.id = u.id
JOIN sign s ON s.name = x.sign_name
LEFT JOIN planet pl ON pl.name = x.planet_name
JOIN card_definition cd ON cd.sign_id = s.id
    AND ((x.planet_name IS NULL AND cd.type = 'ASCENDANT' AND cd.planet_id IS NULL)
      OR (x.planet_name IS NOT NULL AND cd.type = 'CREATURE' AND cd.planet_id = pl.id))
WHERE NOT EXISTS (SELECT 1 FROM player_card pc WHERE pc.player_id = p.id);

-- -----------------------------------------------------------------------------
-- 4) Mazzi (con l'Ascendente) e le loro 7 creature
--    Per ogni carta si usa la copia più vecchia (id più basso), come fa il backend.
-- -----------------------------------------------------------------------------
INSERT INTO deck (player_id, name, ascendant_card_id, version, updated_at)
SELECT p.id, x.deck_name,
       (SELECT MIN(pc.id)
        FROM player_card pc
        JOIN card_definition cd ON cd.id = pc.card_definition_id
        WHERE pc.player_id = p.id AND cd.type = 'ASCENDANT' AND cd.sign_id = s.id),
       0, NOW(6)
FROM seed_deck_card x
JOIN app_user u ON u.email = x.email
JOIN player p ON p.id = u.id
JOIN sign s ON s.name = x.sign_name
WHERE x.planet_name IS NULL
  AND NOT EXISTS (SELECT 1 FROM deck d WHERE d.player_id = p.id AND d.name = x.deck_name);

INSERT INTO deck_card (deck_id, player_card_id)
SELECT d.id,
       (SELECT MIN(pc.id) FROM player_card pc
        WHERE pc.player_id = p.id AND pc.card_definition_id = cd.id)
FROM seed_deck_card x
JOIN app_user u ON u.email = x.email
JOIN player p ON p.id = u.id
JOIN deck d ON d.player_id = p.id AND d.name = x.deck_name
JOIN sign s ON s.name = x.sign_name
JOIN planet pl ON pl.name = x.planet_name
JOIN card_definition cd ON cd.type = 'CREATURE' AND cd.sign_id = s.id AND cd.planet_id = pl.id
WHERE NOT EXISTS (SELECT 1 FROM deck_card dc WHERE dc.deck_id = d.id);

DROP TEMPORARY TABLE IF EXISTS seed_owned_card;
DROP TEMPORARY TABLE IF EXISTS seed_deck_card;

-- -----------------------------------------------------------------------------
-- 5) Sfida in attesa: Vega sfida Antares con il "Cielo di Fuoco"
--    Si crea una sola volta: se tra i due esiste già una sfida (anche giocata),
--    non se ne aggiunge un'altra. Per ricominciare: docker compose down -v.
--
--    Come ChallengeService.create: copia del mazzo con la Fazione del momento
--    (challenge_deck_snapshot) e le 7 creature in ordine di copia.
--    La copia appena creata è quella non ancora usata da nessuna sfida o partita.
-- -----------------------------------------------------------------------------
INSERT INTO challenge_deck_snapshot (captured_at, god, ascendant_card_definition_id)
SELECT NOW(6), pa.god, asc_card.card_definition_id
FROM app_user ua
JOIN player pa ON pa.id = ua.id
JOIN app_user ub ON ub.email = 'antares@zodiax.test'
JOIN player pb ON pb.id = ub.id
JOIN deck d ON d.player_id = pa.id AND d.name = 'Cielo di Fuoco'
LEFT JOIN player_card asc_card ON asc_card.id = d.ascendant_card_id
WHERE ua.email = 'vega@zodiax.test'
  AND pa.god IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM challenge c
      WHERE (c.challenger_id = pa.id AND c.challenged_id = pb.id)
         OR (c.challenger_id = pb.id AND c.challenged_id = pa.id));

INSERT INTO challenge_deck_card_snapshot (deck_snapshot_id, card_definition_id, position)
SELECT snap.id, cards.card_definition_id, cards.position
FROM (
    SELECT MAX(s.id) AS id
    FROM challenge_deck_snapshot s
    WHERE NOT EXISTS (SELECT 1 FROM challenge c WHERE c.challenger_deck_snapshot_id = s.id)
      AND NOT EXISTS (SELECT 1 FROM game_match m
                      WHERE m.challenger_deck_snapshot_id = s.id OR m.challenged_deck_snapshot_id = s.id)
) snap
JOIN (
    SELECT pc.card_definition_id,
           ROW_NUMBER() OVER (ORDER BY pc.id) - 1 AS position
    FROM app_user u
    JOIN deck d ON d.player_id = u.id AND d.name = 'Cielo di Fuoco'
    JOIN deck_card dc ON dc.deck_id = d.id
    JOIN player_card pc ON pc.id = dc.player_card_id
    WHERE u.email = 'vega@zodiax.test'
) cards
WHERE snap.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM challenge_deck_card_snapshot cs WHERE cs.deck_snapshot_id = snap.id);

INSERT INTO challenge (challenger_id, challenged_id, status, challenger_deck_snapshot_id, created_at, updated_at)
SELECT pa.id, pb.id, 'PENDING', snap.id, NOW(6), NOW(6)
FROM app_user ua
JOIN player pa ON pa.id = ua.id
JOIN app_user ub ON ub.email = 'antares@zodiax.test'
JOIN player pb ON pb.id = ub.id
JOIN (
    SELECT MAX(s.id) AS id
    FROM challenge_deck_snapshot s
    WHERE NOT EXISTS (SELECT 1 FROM challenge c WHERE c.challenger_deck_snapshot_id = s.id)
      AND NOT EXISTS (SELECT 1 FROM game_match m
                      WHERE m.challenger_deck_snapshot_id = s.id OR m.challenged_deck_snapshot_id = s.id)
) snap ON snap.id IS NOT NULL
WHERE ua.email = 'vega@zodiax.test'
  AND NOT EXISTS (
      SELECT 1 FROM challenge c
      WHERE (c.challenger_id = pa.id AND c.challenged_id = pb.id)
         OR (c.challenger_id = pb.id AND c.challenged_id = pa.id));
