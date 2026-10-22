INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01PTCH00000000000000000000', 'profe@encuestas.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01PRDR00000000000000000000', 'lector@encuestas.kurasu.test', 'Lector', 'fox', 'student', 1),
  ('01PVTA00000000000000000000', 'ana@encuestas.kurasu.test', 'Ana', 'panda', 'student', 1),
  ('01PVTB00000000000000000000', 'beto@encuestas.kurasu.test', 'Beto', 'frog', 'student', 1);

INSERT INTO sessions (id, position, title, summary, enabled) VALUES
  ('01PSA000000000000000000000', 1, 'Con encuestas', 'Resumen', 1),
  ('01PSB000000000000000000000', 2, 'Deshabilitada', 'Resumen', 0),
  ('01PSC000000000000000000000', 3, 'Del profe', 'Resumen', 1),
  ('01PSD000000000000000000000', 4, 'Nube grande', 'Resumen', 1);

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
  ('01PD8000000000000000000000', '01PSC000000000000000000000', 'scale', 'draft', 'Escala sin opciones', NULL, 'Poco', 'Mucho', NULL),
  ('01PW1000000000000000000000', '01PSD000000000000000000000', 'words', 'closed', 'Muchas palabras', NULL, NULL, NULL, NULL);

INSERT INTO responses (id, poll_id, user_id, value) VALUES
  ('01PRSP01000000000000000000', '01PQ2000000000000000000000', '01PRDR00000000000000000000', '{"scale":4}'),
  ('01PRSP02000000000000000000', '01PQ3000000000000000000000', '01PVTB00000000000000000000', '{"choice":1}'),
  ('01PRSP03000000000000000000', '01PQ4000000000000000000000', '01PRDR00000000000000000000', '{"words":["hola"]}'),
  ('01PRSP04000000000000000000', '01PV2000000000000000000000', '01PVTA00000000000000000000', '{"scale":2}'),
  ('01PRSP05000000000000000000', '01PV3000000000000000000000', '01PVTA00000000000000000000', '{"words":["uno","dos"]}');

-- A closed word cloud with 12 votes and 107 different words: every student
-- sent "todos", two of them "dos", and each the rest of their own.
INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01PWS010000000000000000000', 'nube01@encuestas.kurasu.test', 'Nube 01', 'owl', 'student', 1),
  ('01PWS020000000000000000000', 'nube02@encuestas.kurasu.test', 'Nube 02', 'owl', 'student', 1),
  ('01PWS030000000000000000000', 'nube03@encuestas.kurasu.test', 'Nube 03', 'owl', 'student', 1),
  ('01PWS040000000000000000000', 'nube04@encuestas.kurasu.test', 'Nube 04', 'owl', 'student', 1),
  ('01PWS050000000000000000000', 'nube05@encuestas.kurasu.test', 'Nube 05', 'owl', 'student', 1),
  ('01PWS060000000000000000000', 'nube06@encuestas.kurasu.test', 'Nube 06', 'owl', 'student', 1),
  ('01PWS070000000000000000000', 'nube07@encuestas.kurasu.test', 'Nube 07', 'owl', 'student', 1),
  ('01PWS080000000000000000000', 'nube08@encuestas.kurasu.test', 'Nube 08', 'owl', 'student', 1),
  ('01PWS090000000000000000000', 'nube09@encuestas.kurasu.test', 'Nube 09', 'owl', 'student', 1),
  ('01PWS100000000000000000000', 'nube10@encuestas.kurasu.test', 'Nube 10', 'owl', 'student', 1),
  ('01PWS110000000000000000000', 'nube11@encuestas.kurasu.test', 'Nube 11', 'owl', 'student', 1),
  ('01PWS120000000000000000000', 'nube12@encuestas.kurasu.test', 'Nube 12', 'owl', 'student', 1);

INSERT INTO responses (id, poll_id, user_id, value) VALUES
  ('01PWR010000000000000000000', '01PW1000000000000000000000', '01PWS010000000000000000000', '{"words":["todos","dos","p011","p012","p013","p014","p015","p016","p017","p018"]}'),
  ('01PWR020000000000000000000', '01PW1000000000000000000000', '01PWS020000000000000000000', '{"words":["todos","dos","p021","p022","p023","p024","p025","p026","p027","p028"]}'),
  ('01PWR030000000000000000000', '01PW1000000000000000000000', '01PWS030000000000000000000', '{"words":["todos","todos","p031","p032","p033","p034","p035","p036","p037","p038"]}'),
  ('01PWR040000000000000000000', '01PW1000000000000000000000', '01PWS040000000000000000000', '{"words":["todos","p041","p042","p043","p044","p045","p046","p047","p048","p049"]}'),
  ('01PWR050000000000000000000', '01PW1000000000000000000000', '01PWS050000000000000000000', '{"words":["todos","p051","p052","p053","p054","p055","p056","p057","p058","p059"]}'),
  ('01PWR060000000000000000000', '01PW1000000000000000000000', '01PWS060000000000000000000', '{"words":["todos","p061","p062","p063","p064","p065","p066","p067","p068","p069"]}'),
  ('01PWR070000000000000000000', '01PW1000000000000000000000', '01PWS070000000000000000000', '{"words":["todos","p071","p072","p073","p074","p075","p076","p077","p078","p079"]}'),
  ('01PWR080000000000000000000', '01PW1000000000000000000000', '01PWS080000000000000000000', '{"words":["todos","p081","p082","p083","p084","p085","p086","p087","p088","p089"]}'),
  ('01PWR090000000000000000000', '01PW1000000000000000000000', '01PWS090000000000000000000', '{"words":["todos","p091","p092","p093","p094","p095","p096","p097","p098","p099"]}'),
  ('01PWR100000000000000000000', '01PW1000000000000000000000', '01PWS100000000000000000000', '{"words":["todos","p101","p102","p103","p104","p105","p106","p107","p108","p109"]}'),
  ('01PWR110000000000000000000', '01PW1000000000000000000000', '01PWS110000000000000000000', '{"words":["todos","p111","p112","p113","p114","p115","p116","p117","p118","p119"]}'),
  ('01PWR120000000000000000000', '01PW1000000000000000000000', '01PWS120000000000000000000', '{"words":["todos","p121","p122","p123","p124","p125","p126","p127","p128","p129"]}');
