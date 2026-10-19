INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01M3TC5H0SCQDYY092VEEBA77W', 'profe@me.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01M3TC5H0TT9NDP9EHB2FBE382', 'ana@me.kurasu.test', 'Ana', 'fox', 'student', 1),
  ('01M3TC5H0V0SQQCZZ26N1T09N6', 'bruno@me.kurasu.test', 'Bruno', 'panda', 'student', 1),
  ('01M3TC5H0WARFJQ7EY3QJ2V0S5', 'carla@me.kurasu.test', NULL, NULL, 'student', 1),
  ('01M3TC5H0X7280MS6Y8WY6G10X', 'diego@me.kurasu.test', 'Diego', 'frog', 'student', 1),
  ('01M3TC5H18NBZASGRV7NFKV0CM', 'elena@me.kurasu.test', 'Elena', 'cat', 'student', 1),
  ('01M3TC5H19353B14Y80FR1JSF1', 'fede@me.kurasu.test', 'Fede', 'dog', 'student', 1);

INSERT INTO codes (id, type, code, user_id) VALUES
  ('01M3TC5H0YGQEPQ2ZJMW86ZY67', 'user', 'me-ana-code', '01M3TC5H0TT9NDP9EHB2FBE382'),
  ('01M3TC5H0ZAP6WZRE8ZX6XANW6', 'user', 'me-bruno-code', '01M3TC5H0V0SQQCZZ26N1T09N6'),
  ('01M3TC5H10XXS4AD2TVBG5YTW4', 'user', 'me-carla-code', '01M3TC5H0WARFJQ7EY3QJ2V0S5'),
  ('01M3TC5H11N8X8FHFTSHN5GWBB', 'user', 'me-diego-code', '01M3TC5H0X7280MS6Y8WY6G10X'),
  ('01M3TC5H1AG9ZWRDFA0984P1D0', 'user', 'me-elena-code', '01M3TC5H18NBZASGRV7NFKV0CM'),
  ('01M3TC5H1B4R3K5GWFM7QV3X2N', 'user', 'me-fede-code', '01M3TC5H19353B14Y80FR1JSF1'),
  ('01M3TC5H122YP5EHNDQMAA0730', 'enrollment', 'M3ENR', NULL);
