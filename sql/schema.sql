create database if not exists gitDiary;
use gitDiary;


create table entries (
    int entryNumber primary key int AUTO_INCREMENT,
    entryTitle varchar(255) not null,
    entryContent text not null,
    createdAt timestamp default current_timestamp
)