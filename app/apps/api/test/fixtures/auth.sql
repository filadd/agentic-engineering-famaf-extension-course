INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01M3TC5H00VS9BKJ090A04RZWT', 'profe@auth.kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01M3TC5H01YTTF13GRJ51116AJ', 'lucia@auth.kurasu.test', 'Lucía', 'fox', 'student', 1),
  ('01M3TC5H02R3DDXBRZGJH8XK1K', 'marta@auth.kurasu.test', 'Marta', 'panda', 'student', 1),
  ('01M3TC5H03KK9QPRAM27VWA2W9', 'sinacceso@auth.kurasu.test', 'Sin Acceso', 'frog', 'student', 0),
  ('01M3TC5H04PFQ47HVYXBWSWQNY', 'fuera@auth.kurasu.test', 'Fuera', 'koala', 'student', 1),
  ('01M3TC5H05CG5QE1JFEGAF189E', 'pedro@auth.kurasu.test', 'Pedro', 'lion', 'student', 1),
  ('01M3TC5H06D61D6HX4DXMWP4RH', 'rosa@auth.kurasu.test', 'Rosa', 'tiger', 'student', 1),
  ('01M3TC5H07ZYPFVSCWN28TE4TX', 'tomas@auth.kurasu.test', 'Tomás', 'bear', 'student', 1),
  ('01M3TC5H083Y8AD5ENMGQPP08J', 'julia@auth.kurasu.test', 'Julia', 'rabbit', 'student', 1),
  ('01M3TC5H09YYZ1MFAZ6MDZ48W1', 'leo@auth.kurasu.test', 'Leo', 'dog', 'student', 1),
  ('01M3TC5H0AEEY2Q1CXXF64N3H0', 'dario@auth.kurasu.test', 'Darío', 'cat', 'student', 1);

INSERT INTO codes (id, type, code, user_id, deleted_at) VALUES
  ('01M3TC5H0MYG2JX1ZWFS8J2W9Y', 'user', 'auth-julia-code', '01M3TC5H083Y8AD5ENMGQPP08J', NULL),
  ('01M3TC5H0NS60EN8FTPW4W39F4', 'user', 'auth-leo-code', '01M3TC5H09YYZ1MFAZ6MDZ48W1', NULL),
  ('01M3TC5H0PHW0VBW24BRSXC2YR', 'user', 'auth-dario-code', '01M3TC5H0AEEY2Q1CXXF64N3H0', NULL),
  ('01M3TC5H0QM3TEX3P95THEHB17', 'enrollment', 'W8MRT', NULL, 1790000000000),
  ('01M3TC5H0RXHRYV9XZD9QADJX9', 'enrollment', 'H4XQ9', NULL, NULL);
