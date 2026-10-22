INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01ATCH00000000000000000000', 'profe@anuncios.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01AST100000000000000000000', 'ana@anuncios.kurasu.test', 'Ana', 'fox', 'student', 1),
  ('01AST200000000000000000000', 'beto@anuncios.kurasu.test', 'Beto', 'frog', 'student', 1),
  ('01AST300000000000000000000', 'caro@anuncios.kurasu.test', 'Caro', 'panda', 'student', 1),
  ('01AST400000000000000000000', 'dani@anuncios.kurasu.test', 'Dani', 'koala', 'student', 0);

INSERT INTO sessions (id, position, title, summary, enabled) VALUES
  ('01AS0100000000000000000000', 1, 'Anuncio completo', 'Resumen', 1),
  ('01AS0200000000000000000000', 2, 'Solo mensaje', 'Resumen', 1),
  ('01AS0300000000000000000000', 3, 'Solo novedades', 'Resumen', 1),
  ('01AS0400000000000000000000', 4, 'Mensaje vacío', 'Resumen', 1),
  ('01AS0500000000000000000000', 5, 'Ids descartados', 'Resumen', 1),
  ('01AS0600000000000000000000', 6, 'Otra sesión', 'Resumen', 1),
  ('01AS0700000000000000000000', 7, 'Ids que no están', 'Resumen', 1),
  ('01AS0800000000000000000000', 8, 'Deshabilitada', 'Resumen', 0),
  ('01AS0900000000000000000000', 9, 'Mensaje con HTML', 'Resumen', 1),
  ('01AS1000000000000000000000', 10, 'Destacada', 'Resumen', 1),
  ('01AS1100000000000000000000', 0, 'Demasiadas novedades', 'Resumen', 1);

INSERT INTO changelog_entries (id, session_id, type, entity_id, name, created_at) VALUES
  ('01AE1A00000000000000000000', '01AS0100000000000000000000', 'session-enabled', '01AS0100000000000000000000', 'Anuncio completo', 1790000000000),
  ('01AE1B00000000000000000000', '01AS0100000000000000000000', 'material-added', '01AM1B00000000000000000000', 'slides.html', 1790000001000),
  ('01AE1C00000000000000000000', '01AS0100000000000000000000', 'poll-opened', '01AP1C00000000000000000000', '¿Qué agente usás?', 1790000002000),
  ('01AE0200000000000000000000', '01AS0200000000000000000000', 'material-added', '01AM0200000000000000000000', 'Apunte que queda', 1790000000000),
  ('01AE0300000000000000000000', '01AS0300000000000000000000', 'material-added', '01AM0300000000000000000000', 'Apunte suelto', 1790000000000),
  ('01AE0500000000000000000000', '01AS0500000000000000000000', 'material-added', '01AM0500000000000000000000', 'Apunte pendiente', 1790000000000),
  ('01AE0600000000000000000000', '01AS0600000000000000000000', 'material-added', '01AM0600000000000000000000', 'Apunte de otra sesión', 1790000000000),
  ('01AE0800000000000000000000', '01AS0800000000000000000000', 'material-added', '01AM0800000000000000000000', 'Apunte oculto', 1790000000000),
  ('01AE1100000000000000000000', '01AS1100000000000000000000', 'material-added', '01AM1100000000000000000000', 'Apunte de más', 1790000000000);
