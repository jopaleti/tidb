export const journal = `CREATE TABLE journal (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL)`;
