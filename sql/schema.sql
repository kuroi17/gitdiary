create database if not exists gitDiary;
use gitDiary;


create table entries (
    entryNumber int primary key AUTO_INCREMENT,
    entryTitle varchar(255) not null,
    entryContent text not null,
    entryMedia varchar(255) null,
    createdAt timestamp default current_timestamp

    
)