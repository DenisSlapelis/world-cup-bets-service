-- GROUP_A
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-20 16:00', (SELECT id FROM team WHERE name = 'Catar'), (SELECT id FROM team WHERE name = 'Equador'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-21 16:00', (SELECT id FROM team WHERE name = 'Senegal'), (SELECT id FROM team WHERE name = 'Holanda'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-25 13:00', (SELECT id FROM team WHERE name = 'Catar'), (SELECT id FROM team WHERE name = 'Senegal'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-25 16:00', (SELECT id FROM team WHERE name = 'Holanda'), (SELECT id FROM team WHERE name = 'Equador'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-29 15:00', (SELECT id FROM team WHERE name = 'Equador'), (SELECT id FROM team WHERE name = 'Senegal'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-29 15:00', (SELECT id FROM team WHERE name = 'Catar'), (SELECT id FROM team WHERE name = 'Holanda'));

-- Grupo B
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 6, 7, 'GROUP_B', '2022-11-21 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 5, 8, 'GROUP_B', '2022-11-21 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 8, 7, 'GROUP_B', '2022-11-25 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 6, 5, 'GROUP_B', '2022-11-25 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 7, 5, 'GROUP_B', '2022-11-29 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 8, 6, 'GROUP_B', '2022-11-29 19:00');


-- Grupo C
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 9, 10, 'GROUP_C', '2022-11-22 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 11, 12, 'GROUP_C', '2022-11-22 16:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 12, 10, 'GROUP_C', '2022-11-26 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 9, 11, 'GROUP_C', '2022-11-26 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 12, 9, 'GROUP_C', '2022-11-30 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 10, 11, 'GROUP_C', '2022-11-30 19:00');

-- Grupo D
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 14, 16, 'GROUP_D', '2022-11-22 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 15, 13, 'GROUP_D', '2022-11-22 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 16, 13, 'GROUP_D', '2022-11-26 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 15, 14, 'GROUP_D', '2022-11-26 16:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 16, 15, 'GROUP_D', '2022-11-30 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 13, 14, 'GROUP_D', '2022-11-30 15:00');

-- Grupo E
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 17, 20, 'GROUP_E', '2022-11-23 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 19, 18, 'GROUP_E', '2022-11-23 16:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 20, 18, 'GROUP_E', '2022-11-27 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 19, 17, 'GROUP_E', '2022-11-27 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 20, 19, 'GROUP_E', '2022-12-01 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 18, 17, 'GROUP_E', '2022-12-01 19:00');

-- Grupo F
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 24, 23, 'GROUP_F', '2022-11-23 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 21, 22, 'GROUP_F', '2022-11-23 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 21, 24, 'GROUP_F', '2022-11-27 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 23, 22, 'GROUP_F', '2022-11-27 16:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 23, 21, 'GROUP_F', '2022-12-01 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 22, 24, 'GROUP_F', '2022-12-01 15:00');

-- Grupo G
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 27, 26, 'GROUP_G', '2022-11-24 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 25, 28, 'GROUP_G', '2022-11-24 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 26, 28, 'GROUP_G', '2022-11-28 10:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 25, 27, 'GROUP_G', '2022-11-28 16:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 26, 25, 'GROUP_G', '2022-12-02 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 28, 27, 'GROUP_G', '2022-12-02 19:00');


-- Grupo H
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 32, 29, 'GROUP_H', '2022-11-24 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 31, 30, 'GROUP_H', '2022-11-24 16:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 29, 30, 'GROUP_H', '2022-11-28 13:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 31, 32, 'GROUP_H', '2022-11-28 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 29, 31, 'GROUP_H', '2022-12-02 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 30, 32, 'GROUP_H', '2022-12-02 15:00');

-- OITAVAS
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 3, 5, 'ROUND_OF_16', '2022-12-03 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 9, 13, 'ROUND_OF_16', '2022-12-03 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 15, 12, 'ROUND_OF_16', '2022-12-04 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 6, 4, 'ROUND_OF_16', '2022-12-04 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 20, 23, 'ROUND_OF_16', '2022-12-05 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 24, 19, 'ROUND_OF_16', '2022-12-06 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 25, 29, 'ROUND_OF_16', '2022-12-05 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 31, 27, 'ROUND_OF_16', '2022-12-06 19:00');

-- QUARTAS
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 23, 25, 'QUARTER_FINAL', '2022-12-09 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 3, 9, 'QUARTER_FINAL', '2022-12-09 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 24, 31, 'QUARTER_FINAL', '2022-12-10 15:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 6, 15, 'QUARTER_FINAL', '2022-12-10 19:00');

-- SEMI
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 9, 23, 'SEMI_FINAL', '2022-12-13 19:00');
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 15, 24, 'SEMI_FINAL', '2022-12-14 19:00');

-- TERCEIRO LUGAR
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 23, 24, 'SEMI_FINAL', '2022-12-17 15:00');

-- FINAL
INSERT INTO `match` (cup_id, team_a_id, team_b_id, `type`, match_date) VALUES (1, 9, 15, 'SEMI_FINAL', '2022-12-18 15:00');
