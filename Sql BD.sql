-- CAMBIAR Y REINICIAR TABLAS

-- Desactivar temporalmente restricciones de clave foránea
ALTER TABLE votes DISABLE TRIGGER ALL;
ALTER TABLE users DISABLE TRIGGER ALL;
ALTER TABLE people DISABLE TRIGGER ALL;
ALTER TABLE surveys DISABLE TRIGGER ALL;

-- Borrar todos los registros y reiniciar las secuencias
TRUNCATE TABLE votes RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE people RESTART IDENTITY CASCADE;
TRUNCATE TABLE surveys RESTART IDENTITY CASCADE;

-- Volver a activar restricciones
ALTER TABLE votes ENABLE TRIGGER ALL;
ALTER TABLE users ENABLE TRIGGER ALL;
ALTER TABLE people ENABLE TRIGGER ALL;
ALTER TABLE surveys ENABLE TRIGGER ALL;


-- ELIMINAR TODAS LAS SECUENCIAS
DO $$ 
DECLARE 
    seq RECORD;
BEGIN
    FOR seq IN 
        SELECT c.relname AS seqname
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'S' -- 'S' significa secuencia
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || seq.seqname || ' CASCADE';
    END LOOP;
END $$;


-- REINICIO DE BD, BORRADO DE TABLAS Y CREACIÓN NUEVA

-- Eliminar todas las tablas si existen
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;
DROP TABLE IF EXISTS votes CASCADE;



-- Crear tabla people
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Crear tabla users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    id_person INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_person) REFERENCES people(id)
);

-- Crear tabla surveys
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    state BOOLEAN NOT NULL,
    question TEXT NOT NULL,
    answer1 VARCHAR(255) NOT NULL,
    answer2 VARCHAR(255) NOT NULL,
    answer3 VARCHAR(255),
    answer4 VARCHAR(255)
);

-- Crear tabla votes
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    reply TEXT NOT NULL,
    user_id INT NOT NULL,
    survey_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (survey_id) REFERENCES surveys(id)
);

SELECT * FROM people;
SELECT * FROM users;
SELECT * FROM surveys;
SELECT * FROM votes;


-- CREAR REGISTROS

-- Insertar en la tabla persons
INSERT INTO people (name, email)
VALUES ('Elvis Cruces', 'andrecr661@gmail.com');

INSERT INTO people (name, email)
VALUES 
('Lucía Mendoza', 'lucia.mendoza@example.com'),
('Carlos Pérez', 'carlos.perez@example.com'),
('Ana Torres', 'ana.torres@example.com'),
('Javier Ríos', 'javier.rios@example.com'),
('Gabriela Chávez', 'gabriela.chavez@example.com'),
('Fernando Morales', 'fernando.morales@example.com'),
('Sofía Herrera', 'sofia.herrera@example.com'),
('Diego Castro', 'diego.castro@example.com'),
('Valeria Guzmán', 'valeria.guzman@example.com');

-- Insertar en la tabla users
INSERT INTO users (id_person, username, password)
VALUES (1, 'Shifu661', '12345');
INSERT INTO users (id_person, username, password)
VALUES (1, 'admin', 'admin');

INSERT INTO users (id_person, username, password)
VALUES
(2, 'lmendoza', 'pass123'),
(3, 'cperez', 'admin456'),
(4, 'atorres', 'secure789'),
(5, 'jrios', 'clave321'),
(6, 'gchavez', 'pass654'),
(7, 'fmorales', 'mypass987'),
(8, 'sherrera', 'sofia123'),
(9, 'dcastro', 'castro456'),
(10, 'vguzman', 'guzman789');

-- Insertar en la tabla surveys
INSERT INTO surveys (state, question, answer1, answer2, answer3, answer4)
VALUES (true, 'What is your favorite color?', 'Red', 'Blue', 'Green', 'Yellow');

-- Insertar en la tabla votes
INSERT INTO votes (reply, user_id, survey_id)
VALUES ('Blue', 1, 1);

INSERT INTO votes (reply, user_id, survey_id)
VALUES ('24', 1, 3);

INSERT INTO votes (reply, user_id, survey_id)
VALUES ('Perú', 1, 5);

INSERT INTO votes (reply, user_id, survey_id)
VALUES ('Software Engineering', 1, 6);


-- Votos de los usuarios para las encuestas
INSERT INTO votes (reply, user_id, survey_id)
VALUES
-- Lucía Mendoza (ID 2)
('Blue', 2, 1),
('Real Madrid', 2, 2),
('18', 2, 3),
('Japón', 2, 5),
('Medicine', 2, 6),

-- Carlos Pérez (ID 3)
('Green', 3, 1),
('Barcelona', 3, 2),
('24', 3, 3),
('EEUU', 3, 5),
('Law', 3, 6),

-- Ana Torres (ID 4)
('Yellow', 4, 1),
('Manchester City', 4, 2),
('30', 4, 3),
('España', 4, 5),
('Business Administration', 4, 6),

-- Javier Ríos (ID 5)
('Red', 5, 1),
('Bayern de Munich', 5, 2),
('15', 5, 3),
('Perú', 5, 5),
('Software Engineering', 5, 6),

-- Gabriela Chávez (ID 6)
('Blue', 6, 1),
('Barcelona', 6, 2),
('24', 6, 3),
('Japón', 6, 5),
('Medicine', 6, 6),

-- Fernando Morales (ID 7)
('Green', 7, 1),
('Real Madrid', 7, 2),
('18', 7, 3),
('EEUU', 7, 5),
('Business Administration', 7, 6),

-- Sofía Herrera (ID 8)
('Yellow', 8, 1),
('Bayern de Munich', 8, 2),
('30', 8, 3),
('España', 8, 5),
('Law', 8, 6),

-- Diego Castro (ID 9)
('Red', 9, 1),
('Manchester City', 9, 2),
('15', 9, 3),
('Perú', 9, 5),
('Software Engineering', 9, 6),

-- Valeria Guzmán (ID 10)
('Blue', 10, 1),
('Real Madrid', 10, 2),
('18', 10, 3),
('Japón', 10, 5),
('Business Administration', 10, 6);


-- Consulta survey actived para un user
SELECT s.id, s.question, s.answer1, s.answer2, s.answer3, s.answer4
FROM surveys s
JOIN votes v ON s.id = v.survey_id
WHERE v.user_id = 1
AND s.state = true;

-- Cambiar state de una encuesta
UPDATE surveys SET state = TRUE WHERE id = 3;
