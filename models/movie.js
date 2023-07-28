export const movie = `CREATE TABLE movie (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int NOT NULL,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    genre VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    year VARCHAR(255),
    actors VARCHAR(255) NOT NULL)`;
