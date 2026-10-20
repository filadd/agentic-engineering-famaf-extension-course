INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01SSPRF0000000000000000000', 'profe@sesiones.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01SSSTD0000000000000000000', 'ana@sesiones.kurasu.test', 'Ana', 'fox', 'student', 1);

INSERT INTO sessions (id, position, title, summary, enabled, current_slide, current_step, deleted_at) VALUES
  ('01SSA100000000000000000000', 1, 'Primera', 'La primera sesión', 1, 3, 2, NULL),
  ('01SSB200000000000000000000', 2, 'Deshabilitada', 'Todavía no', 0, 2, 1, NULL),
  ('01SSC300000000000000000000', 3, 'Borrada', 'Ya no está', 0, 1, 1, 1790000000000),
  ('01SSD400000000000000000000', 3, 'Para editar', 'El resumen de antes', 1, 1, 1, NULL),
  ('01SSF600000000000000000000', 4, 'Para mover', 'La slide se mueve', 1, 1, 1, NULL),
  ('01SSG700000000000000000000', 5, 'Posición cero', 'No se mueve a 0', 1, 2, 2, NULL),
  ('01SSH800000000000000000000', 6, 'Para borrar', 'Deshabilitada con una encuesta', 0, 1, 1, NULL),
  ('01SSJ900000000000000000000', 7, 'Habilitada', 'No se borra', 1, 1, 1, NULL),
  ('01SSE500000000000000000000', 8, 'La destacada', 'Se deshabilita con gente adentro', 1, 4, 2, NULL),
  ('01SSK100000000000000000000', 9, 'Para habilitar', 'Va a ser la destacada', 0, 1, 1, NULL);

INSERT INTO polls (id, session_id, type, status, prompt, options, scale_min_label, scale_max_label, deleted_at) VALUES
  ('01SSPA00000000000000000000', '01SSE500000000000000000000', 'scale', 'active', '¿Cómo venimos?', NULL, 'Mal', 'Bien', NULL),
  ('01SSNA00000000000000000000', '01SSH800000000000000000000', 'words', 'draft', '¿Qué esperás?', NULL, NULL, NULL, NULL);

INSERT INTO raised_hands (session_id, user_id) VALUES
  ('01SSE500000000000000000000', '01SSSTD0000000000000000000');
