create table if not exists users (
  userID int primary key auto_increment,
  username varchar(50) not null unique,
  email varchar(100) not null unique,
  password varchar(255) not null,
  createdAt timestamp default current_timestamp
);