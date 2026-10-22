INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01PTCH00000000000000000000', 'profe@encuestas.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01PRDR00000000000000000000', 'lector@encuestas.kurasu.test', 'Lector', 'fox', 'student', 1),
  ('01PVTA00000000000000000000', 'ana@encuestas.kurasu.test', 'Ana', 'panda', 'student', 1),
  ('01PVTB00000000000000000000', 'beto@encuestas.kurasu.test', 'Beto', 'frog', 'student', 1);

INSERT INTO sessions (id, position, title, summary, enabled) VALUES
  ('01PSA000000000000000000000', 1, 'Con encuestas', 'Resumen', 1),
  ('01PSB000000000000000000000', 2, 'Deshabilitada', 'Resumen', 0),
  ('01PSC000000000000000000000', 3, 'Del profe', 'Resumen', 1);

INSERT INTO polls (id, session_id, type, status, prompt, options, scale_min_label, scale_max_label, deleted_at) VALUES
  ('01PQ1000000000000000000000', '01PSA000000000000000000000', 'choice', 'active', '¿Cuál preferís?', '["Uno","Dos","Tres"]', NULL, NULL, NULL),
  ('01PQ2000000000000000000000', '01PSA000000000000000000000', 'scale', 'active', '¿Cómo venimos?', NULL, 'Mal', 'Bien', NULL),
  ('01PQ3000000000000000000000', '01PSA000000000000000000000', 'choice', 'closed', '¿Qué lenguaje?', '["Python","TypeScript"]', NULL, NULL, NULL),
  ('01PQ4000000000000000000000', '01PSA000000000000000000000', 'words', 'closed', 'Una palabra', NULL, NULL, NULL, NULL),
  ('01PQ5000000000000000000000', '01PSA000000000000000000000', 'choice', 'draft', 'Borrador', '["Sí","No"]', NULL, NULL, NULL),
  ('01PQ6000000000000000000000', '01PSA000000000000000000000', 'words', 'active', 'Borrada', NULL, NULL, NULL, 1790000000000),
  ('01PQ7000000000000000000000', '01PSB000000000000000000000', 'choice', 'active', 'De una deshabilitada', '["Sí","No"]', NULL, NULL, NULL),
  ('01PV1000000000000000000000', '01PSA000000000000000000000', 'choice', 'active', 'Opción múltiple', '["Rojo","Verde","Azul"]', NULL, NULL, NULL),
  ('01PV2000000000000000000000', '01PSA000000000000000000000', 'scale', 'active', 'Escala', NULL, 'Poco', 'Mucho', NULL),
  ('01PV3000000000000000000000', '01PSA000000000000000000000', 'words', 'active', 'Nube', NULL, NULL, NULL, NULL),
  ('01PV4000000000000000000000', '01PSA000000000000000000000', 'choice', 'active', 'Tres opciones', '["A","B","C"]', NULL, NULL, NULL),
  ('01PV5000000000000000000000', '01PSA000000000000000000000', 'scale', 'active', 'Otra escala', NULL, NULL, NULL, NULL),
  ('01PV6000000000000000000000', '01PSA000000000000000000000', 'words', 'active', 'Otra nube', NULL, NULL, NULL, NULL),
  ('01PD1000000000000000000000', '01PSC000000000000000000000', 'choice', 'draft', 'Para editar', '["Sí","No"]', NULL, NULL, NULL),
  ('01PD2000000000000000000000', '01PSC000000000000000000000', 'choice', 'active', 'Activa', '["Sí","No"]', NULL, NULL, NULL),
  ('01PD3000000000000000000000', '01PSC000000000000000000000', 'scale', 'draft', 'Para activar', NULL, NULL, NULL, NULL),
  ('01PD4000000000000000000000', '01PSC000000000000000000000', 'words', 'active', 'Para cerrar', NULL, NULL, NULL, NULL),
  ('01PD5000000000000000000000', '01PSC000000000000000000000', 'choice', 'closed', 'Cerrada', '["Sí","No"]', NULL, NULL, NULL),
  ('01PD6000000000000000000000', '01PSC000000000000000000000', 'scale', 'draft', 'Borrador que no cierra', NULL, NULL, NULL, NULL),
  ('01PD7000000000000000000000', '01PSC000000000000000000000', 'choice', 'active', 'Para borrar', '["Sí","No"]', NULL, NULL, NULL),
  ('01PD8000000000000000000000', '01PSC000000000000000000000', 'scale', 'draft', 'Escala sin opciones', NULL, 'Poco', 'Mucho', NULL);

INSERT INTO responses (id, poll_id, user_id, value) VALUES
  ('01PRSP01000000000000000000', '01PQ2000000000000000000000', '01PRDR00000000000000000000', '{"scale":4}'),
  ('01PRSP02000000000000000000', '01PQ3000000000000000000000', '01PVTB00000000000000000000', '{"choice":1}'),
  ('01PRSP03000000000000000000', '01PQ4000000000000000000000', '01PRDR00000000000000000000', '{"words":["hola"]}'),
  ('01PRSP04000000000000000000', '01PV2000000000000000000000', '01PVTA00000000000000000000', '{"scale":2}'),
  ('01PRSP05000000000000000000', '01PV3000000000000000000000', '01PVTA00000000000000000000', '{"words":["uno","dos"]}');
