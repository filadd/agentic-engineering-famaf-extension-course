INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01ATCH00000000000000000000', 'profe@solo.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01AST400000000000000000000', 'dani@solo.kurasu.test', 'Dani', 'koala', 'student', 0);

INSERT INTO sessions (id, position, title, summary, enabled) VALUES
  ('01AS0100000000000000000000', 1, 'Sin estudiantes', 'Resumen', 1);

INSERT INTO changelog_entries (id, session_id, type, entity_id, name, created_at) VALUES
  ('01AE0100000000000000000000', '01AS0100000000000000000000', 'material-added', '01AM0100000000000000000000', 'Apunte', 1790000000000);
