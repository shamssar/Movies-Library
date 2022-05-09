DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    release_data varchar(255),
    poster_path varchar(255),
    overview varchar(255)
);


