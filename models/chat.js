export const chats = `CREATE TABLE chats (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int NOT NULL,
    role VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL)`;
