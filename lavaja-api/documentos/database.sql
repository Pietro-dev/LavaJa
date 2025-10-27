create database lavaja;

create table servico (
	Id bigserial not null primary key,
	Servico varchar(255),
	Descricao varchar(255),
	Valor numeric(16, 2),
	Duracao numeric(16, 2),
	Data_cadastro date
);
