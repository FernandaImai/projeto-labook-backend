-- Active: 1701523753199@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')) 
);

SELECT * FROM users;
DROP TABLE users;

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL ,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    updated_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    FOREIGN KEY (creator_id) REFERENCES users (id) 
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

DROP TABLE posts;

INSERT INTO users (id, name, email, password,role)
VALUES
	('u001', 'Fulano', 'fulano@email.com', 'fulano123','ADMIN'),
	('u002', 'Beltrana', 'beltrana@email.com', 'beltrana00','NORMAL');

SELECT * FROM posts;

INSERT INTO posts (id, creator_id, content)
VALUES  ('p001', 'u001', 'Hello world!'),
        ('p002', 'u002', 'Odeio CSS');

CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE
);

INSERT INTO likes_dislikes
VALUES
('u001','p001',1),
('u002','p002',1);


SELECT * FROM likes_dislikes;

DROP TABLE likes_dislikes;