INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01MTCH00000000000000000000', 'profe@material.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01MSTD00000000000000000000', 'ana@material.kurasu.test', 'Ana', 'fox', 'student', 1);

INSERT INTO sessions (id, position, title, summary, enabled, current_slide, current_step, deleted_at) VALUES
  ('01MSA000000000000000000000', 1, 'Con material', 'Resumen', 1, 1, 1, NULL),
  ('01MSB000000000000000000000', 2, 'Deshabilitada', 'Resumen', 0, 1, 1, NULL),
  ('01MSC000000000000000000000', 3, 'Borrada', 'Resumen', 0, 1, 1, 1790000000000),
  ('01MSD000000000000000000000', 3, 'Sin slides', 'Resumen', 1, 3, 2, NULL),
  ('01MSE000000000000000000000', 4, 'Con slides', 'Resumen', 1, 2, 2, NULL),
  ('01MSF000000000000000000000', 5, 'Dos HTML', 'Resumen', 1, 2, 1, NULL),
  ('01MSG000000000000000000000', 6, 'Slides para desmarcar', 'Resumen', 1, 2, 2, NULL),
  ('01MSH000000000000000000000', 7, 'Slides para borrar', 'Resumen', 1, 3, 1, NULL);

INSERT INTO materials (id, session_id, name, is_slides, size, content_type) VALUES
  ('01MMA100000000000000000000', '01MSA000000000000000000000', 'Apunte', 0, 10, 'application/pdf'),
  ('01MMA200000000000000000000', '01MSA000000000000000000000', 'Slides', 1, 20, 'text/html'),
  ('01MMB100000000000000000000', '01MSB000000000000000000000', 'Apunte oculto', 0, 10, 'application/pdf'),
  ('01MME100000000000000000000', '01MSE000000000000000000000', 'Slides viejas', 1, 20, 'text/html'),
  ('01MMF100000000000000000000', '01MSF000000000000000000000', 'Slides actuales', 1, 20, 'text/html'),
  ('01MMF200000000000000000000', '01MSF000000000000000000000', 'Otro HTML', 0, 20, 'text/html'),
  ('01MMG100000000000000000000', '01MSG000000000000000000000', 'Slides', 1, 20, 'text/html'),
  ('01MMH100000000000000000000', '01MSH000000000000000000000', 'Slides', 1, 20, 'text/html');
