INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01ATCH00000000000000000000', 'profe@announcement-sixty.kurasu.test', 'Profe', 'owl', 'teacher', 1);

-- Students registered after the teacher, in the order of their number.
WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 60)
INSERT INTO users (id, email, name, avatar, role, has_access)
SELECT printf('01B%023d', i), printf('estudiante%03d@announcement-sixty.kurasu.test', i), NULL, NULL, 'student', 1
FROM n;

INSERT INTO sessions (id, position, title, summary, enabled) VALUES
  ('01AS0100000000000000000000', 1, 'Anuncio para 60', 'Resumen', 1),
  ('01AS0200000000000000000000', 2, 'Destacada', 'Resumen', 1);

INSERT INTO changelog_entries (id, session_id, type, entity_id, name, created_at) VALUES
  ('01AE0100000000000000000000', '01AS0100000000000000000000', 'material-added', '01AM0100000000000000000000', 'Apunte', 1790000000000);
