INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01CTCH00000000000000000000', 'profe@aula.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01CSTA00000000000000000000', 'ana@aula.kurasu.test', 'Ana', 'fox', 'student', 1),
  ('01CSTB00000000000000000000', 'beto@aula.kurasu.test', 'Beto', 'panda', 'student', 1),
  ('01CSTC00000000000000000000', 'carla@aula.kurasu.test', 'Carla', 'frog', 'student', 1);

INSERT INTO sessions (id, position, title, summary, enabled, deleted_at) VALUES
  ('01CSA000000000000000000000', 1, 'Anterior', 'Resumen', 1, NULL),
  ('01CSB000000000000000000000', 2, 'Destacada', 'Resumen', 1, NULL),
  ('01CSD000000000000000000000', 3, 'Deshabilitada', 'Resumen', 0, NULL),
  ('01CSE000000000000000000000', 4, 'Borrada', 'Resumen', 0, 1790000000000);
