INSERT INTO match(cup_id, team_a_id, team_b_id, type, match_date) VALUES (1, );




-- GROUP_A
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-20 13:00', (SELECT id FROM team WHERE name = 'Catar'), (SELECT id FROM team WHERE name = 'Equador'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-21 13:00', (SELECT id FROM team WHERE name = 'Senegal'), (SELECT id FROM team WHERE name = 'Holanda'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-25 10:00', (SELECT id FROM team WHERE name = 'Catar'), (SELECT id FROM team WHERE name = 'Senegal'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-25 13:00', (SELECT id FROM team WHERE name = 'Holanda'), (SELECT id FROM team WHERE name = 'Equador'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-29 12:00', (SELECT id FROM team WHERE name = 'Equador'), (SELECT id FROM team WHERE name = 'Senegal'));
INSERT INTO `match` (cup_id, type, match_date, team_a_id, team_b_id) VALUES (1, 'GROUP_A', '2022-11-29 12:00', (SELECT id FROM team WHERE name = 'Catar'), (SELECT id FROM team WHERE name = 'Holanda'));
