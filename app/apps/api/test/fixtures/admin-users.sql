INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01M3TC5H13G99CJSZ03NS6AKSK', 'profe@usuarios.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01M3TC5H14R89VCZPAAKAXT8JF', 'ana@usuarios.kurasu.test', 'Ana', 'fox', 'student', 1),
  ('01M3TC5H152YGVFX6MAK4M9RPR', 'bruno@usuarios.kurasu.test', 'Bruno', 'panda', 'student', 0),
  ('01M3TC5H16SR8BD62VVFK3QSWJ', 'carla@usuarios.kurasu.test', 'Carla', 'frog', 'student', 1),
  ('01M3TC5H17DV6R0K9RNFXW0T97', 'diego@usuarios.kurasu.test', 'Diego', 'koala', 'student', 0);

INSERT INTO codes (id, type, code, user_id) VALUES
  ('01M3TC5H0BN8G3C7NY7MADG7F4', 'user', 'usuarios-ana-code', '01M3TC5H14R89VCZPAAKAXT8JF'),
  ('01M3TC5H0C491BNFSRCX4E3R77', 'user', 'usuarios-carla-code', '01M3TC5H16SR8BD62VVFK3QSWJ');
