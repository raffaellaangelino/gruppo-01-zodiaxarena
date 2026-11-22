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
-- 2) PIANETI (7)  -- tier: LEGENDARY, EPIC, RARE, COMMON
-- ---------------------------------------------------------------------------
INSERT INTO planet (name, tier, atk, def) VALUES
    ('Sole',     'LEGENDARY', 9, 8),
    ('Luna',     'EPIC',      5, 6),
    ('Marte',    'EPIC',      7, 4),
    ('Giove',    'RARE',      4, 2),
    ('Saturno',  'RARE',      2, 4),
    ('Mercurio', 'COMMON',    2, 0),
    ('Venere',   'COMMON',    0, 2)
AS new
ON DUPLICATE KEY UPDATE tier = new.tier, atk = new.atk, def = new.def;

-- ---------------------------------------------------------------------------
-- 3) CARTE CREATURA (7 pianeti x 12 segni = 84)
--    imgId: za-<NNN>-<pianeta>-<segno>.png
--    NNN = base del pianeta + posizione del segno (Ariete=1 ... Pesci=12)
--    Sole 0, Luna 12, Marte 24, Giove 36, Saturno 48, Mercurio 60, Venere 72
-- ---------------------------------------------------------------------------
INSERT INTO card_definition (type, sign_id, planet_id, house, img_id)
SELECT 'CREATURE', s.id, p.id, 'I', x.img_id
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
INSERT INTO card_definition (type, sign_id, planet_id, house, img_id)
SELECT 'ASCENDANT', s.id, NULL, NULL,
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

-- ---------------------------------------------------------------------------
-- 5) PACCHETTI DEL NEGOZIO (3 al lancio)
--    Solo inserimento: prezzi, slot e probabilita' si cambiano dal backoffice,
--    e un riavvio non deve riportarli ai valori di lancio.
--    Numero di carte e garanzie non si salvano: si ricavano dagli slot.
-- ---------------------------------------------------------------------------
INSERT INTO pack_definition (code, name, role, price, purchase_limit, released_at, active, sort_order)
SELECT x.code, x.name, x.role, x.price, x.purchase_limit, NULL, TRUE, x.sort_order
FROM (
    SELECT 'COSTELLAZIONE' AS code, 'Costellazione' AS name, 'Il pacchetto di tutti i giorni' AS role,
           100 AS price, 'NONE' AS purchase_limit, 1 AS sort_order UNION ALL
    SELECT 'ZENIT', 'Zenit', 'Un''Epica garantita',
           250, 'NONE', 2 UNION ALL
    SELECT 'LUNA_PIENA', 'Luna Piena', 'Un Ascendente garantito, una volta per ciclo lunare',
           600, 'ONCE_PER_LUNAR_CYCLE', 3
) x
WHERE NOT EXISTS (SELECT 1 FROM pack_definition p WHERE p.code = x.code);

-- Slot: intervalli di posizioni per tipo; la Stella e' sempre l'ultimo
--   COSTELLAZIONE (5):  1-3 Comune, 4 Rara, 5 Stella
--   ZENIT (10):         1-6 Comune, 7-8 Rara, 9 Epica, 10 Stella
--   LUNA_PIENA (12):    1-6 Comune, 7-9 Rara, 10 Epica, 11 Ascendente, 12 Stella
INSERT INTO pack_slot (pack_id, slot_number, slot_type)
SELECT p.id, n.n, r.slot_type
FROM (
    SELECT 'COSTELLAZIONE' AS code,  1 AS first_slot,  3 AS last_slot, 'COMMON' AS slot_type UNION ALL
    SELECT 'COSTELLAZIONE',          4,                4,              'RARE'                UNION ALL
    SELECT 'COSTELLAZIONE',          5,                5,              'STAR'                UNION ALL
    SELECT 'ZENIT',                  1,                6,              'COMMON'              UNION ALL
    SELECT 'ZENIT',                  7,                8,              'RARE'                UNION ALL
    SELECT 'ZENIT',                  9,                9,              'EPIC'                UNION ALL
    SELECT 'ZENIT',                 10,               10,              'STAR'                UNION ALL
    SELECT 'LUNA_PIENA',             1,                6,              'COMMON'              UNION ALL
    SELECT 'LUNA_PIENA',             7,                9,              'RARE'                UNION ALL
    SELECT 'LUNA_PIENA',            10,               10,              'EPIC'                UNION ALL
    SELECT 'LUNA_PIENA',            11,               11,              'ASCENDANT'           UNION ALL
    SELECT 'LUNA_PIENA',            12,               12,              'STAR'
) r
JOIN pack_definition p ON p.code = r.code
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
    SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL
    SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
) n ON n.n BETWEEN r.first_slot AND r.last_slot
WHERE NOT EXISTS (SELECT 1 FROM pack_slot s WHERE s.pack_id = p.id AND s.slot_number = n.n);

-- Probabilita' della Stella, uguali per i tre pacchetti al lancio (somma = 1)
INSERT INTO pack_star_odds (pack_id, rarity, probability)
SELECT p.id, o.rarity, o.probability
FROM pack_definition p
JOIN (
    SELECT 'RARE' AS rarity, 0.6000 AS probability UNION ALL
    SELECT 'EPIC',           0.3000                UNION ALL
    SELECT 'LEGENDARY',      0.0800                UNION ALL
    SELECT 'ASCENDANT',      0.0200
) o
WHERE p.code IN ('COSTELLAZIONE', 'ZENIT', 'LUNA_PIENA')
  AND NOT EXISTS (SELECT 1 FROM pack_star_odds s WHERE s.pack_id = p.id AND s.rarity = o.rarity);
