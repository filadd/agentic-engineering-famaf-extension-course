INSERT INTO users (id, email, name, avatar, role, has_access) VALUES
  ('01M58ZVRXJ0RXE825MJ2NNQ7GH', 'profe@kurasu.test', 'Profe', 'owl', 'teacher', 1),
  ('01M58ZVRXKHK52RKZ9TT22RCCT', 'ana@kurasu.test', 'Ana', 'fox', 'student', 1),
  ('01M58ZVRXMPA94CFEEXHBR6GGH', 'blocked@kurasu.test', 'Bruno', 'panda', 'student', 1);

INSERT INTO codes (id, type, code, user_id) VALUES
  ('01M58ZVRXNEXGS6GV09HWE9DM9', 'user', 'harness-ana-code', '01M58ZVRXKHK52RKZ9TT22RCCT');
