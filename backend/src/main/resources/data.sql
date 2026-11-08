-- ZodiaxArena: seed di segni, pianeti e carte (Casa I, set di lancio)
-- Idempotente: si puo' rieseguire (o usare come data.sql) senza creare duplicati.
-- Richiede che le tabelle sign, planet e card_definition esistano gia'.

-- ---------------------------------------------------------------------------
-- 1) SEGNI (12)  -- valori base dal regolamento, budget 20 punti ATK+DEF
--    Segni d'Aria: ATK/DEF reali = 2d4 x 2, tirati dal motore all'ingresso in
--    gioco. 10/10 e' solo la media, usata come segnaposto (colonne NOT NULL).
-- ---------------------------------------------------------------------------
INSERT INTO sign (name, type, atk, def) VALUES
    ('Ariete',      'FIRE',  13,  7),
    ('Leone',       'FIRE',  12,  8),
    ('Sagittario',  'FIRE',  10, 10),
    ('Toro',        'EARTH',  8, 12),
    ('Vergine',     'EARTH', 10, 10),
    ('Capricorno',  'EARTH', 12,  8),
    ('Gemelli',     'AIR',   10, 10),
    ('Bilancia',    'AIR',   10, 10),
    ('Acquario',    'AIR',   10, 10),
    ('Cancro',      'WATER',  7, 13),
    ('Scorpione',   'WATER',  8, 12),
    ('Pesci',       'WATER', 10, 10)
AS new
ON DUPLICATE KEY UPDATE type = new.type, atk = new.atk, def = new.def;

-- ---------------------------------------------------------------------------
-- 2) PIANETI (7)  -- tier: 1 = Leggendaria, 2 = Epica, 3 = Rara, 4 = Comune
-- ---------------------------------------------------------------------------
INSERT INTO planet (name, tier, atk, def) VALUES
    ('Sole',     1, 9, 8),
    ('Luna',     2, 5, 6),
    ('Marte',    2, 7, 4),
    ('Giove',    3, 4, 2),
    ('Saturno',  3, 2, 4),
    ('Mercurio', 4, 2, 0),
    ('Venere',   4, 0, 2)
AS new
ON DUPLICATE KEY UPDATE tier = new.tier, atk = new.atk, def = new.def;

-- ---------------------------------------------------------------------------
-- 3) CARTE CREATURA (7 pianeti x 12 segni = 84)
--    imgId: za-<NNN>-<pianeta>-<segno>.png
--    NNN = base del pianeta + posizione del segno (Ariete=1 ... Pesci=12)
--    Sole 0, Luna 12, Marte 24, Giove 36, Saturno 48, Mercurio 60, Venere 72
-- ---------------------------------------------------------------------------
INSERT INTO card_definition (type, sign_id, planet_id, img_id)
SELECT 'CREATURE', s.id, p.id, x.img_id
FROM (
    SELECT po.planet_name,
           so.sign_name,
           CONCAT('za-', LPAD(po.base + so.idx, 3, '0'), '-',
                  LOWER(po.planet_name), '-', LOWER(so.sign_name), '.png') AS img_id
    FROM (
        SELECT 'Sole'     AS planet_name,  0 AS base UNION ALL
        SELECT 'Luna',                    12          UNION ALL
        SELECT 'Marte',                   24          UNION ALL
        SELECT 'Giove',                   36          UNION ALL
        SELECT 'Saturno',                 48          UNION ALL
        SELECT 'Mercurio',                60          UNION ALL
        SELECT 'Venere',                  72
    ) po
    CROSS JOIN (
        SELECT 'Ariete'     AS sign_name,  1 AS idx UNION ALL
        SELECT 'Toro',                      2       UNION ALL
        SELECT 'Gemelli',                   3       UNION ALL
        SELECT 'Cancro',                    4       UNION ALL
        SELECT 'Leone',                     5       UNION ALL
        SELECT 'Vergine',                   6       UNION ALL
        SELECT 'Bilancia',                  7       UNION ALL
        SELECT 'Scorpione',                 8       UNION ALL
        SELECT 'Sagittario',                9       UNION ALL
        SELECT 'Capricorno',               10       UNION ALL
        SELECT 'Acquario',                 11       UNION ALL
        SELECT 'Pesci',                    12
    ) so
) x
JOIN sign   s ON s.name = x.sign_name
JOIN planet p ON p.name = x.planet_name
WHERE NOT EXISTS (SELECT 1 FROM card_definition c WHERE c.img_id = x.img_id);

-- ---------------------------------------------------------------------------
-- 4) CARTE ASCENDENTE (12, una per segno, nessun pianeta)
--    imgId: za-asc-<NN>-ascendente-<segno>.png
-- ---------------------------------------------------------------------------
INSERT INTO card_definition (type, sign_id, planet_id, img_id)
SELECT 'ASCENDANT', s.id, NULL,
       CONCAT('za-asc-', LPAD(so.idx, 2, '0'), '-ascendente-', LOWER(so.sign_name), '.png')
FROM (
    SELECT 'Ariete'     AS sign_name,  1 AS idx UNION ALL
    SELECT 'Toro',                      2       UNION ALL
    SELECT 'Gemelli',                   3       UNION ALL
    SELECT 'Cancro',                    4       UNION ALL
    SELECT 'Leone',                     5       UNION ALL
    SELECT 'Vergine',                   6       UNION ALL
    SELECT 'Bilancia',                  7       UNION ALL
    SELECT 'Scorpione',                 8       UNION ALL
    SELECT 'Sagittario',                9       UNION ALL
    SELECT 'Capricorno',               10       UNION ALL
    SELECT 'Acquario',                 11       UNION ALL
    SELECT 'Pesci',                    12
) so
JOIN sign s ON s.name = so.sign_name
WHERE NOT EXISTS (
    SELECT 1 FROM card_definition c
    WHERE c.img_id = CONCAT('za-asc-', LPAD(so.idx, 2, '0'), '-ascendente-', LOWER(so.sign_name), '.png')
);
