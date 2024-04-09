# daily-diet-api

API desenvolvida durante os estudos da trilha de Node.js do Ignite da Rocketseat. A aplicação consiste em uma API REST para cadastrar informações sobre refeições no dia-a-dia.

## Funcionalidades do projeto
- criar um usuário
- identificar o usuário entre as requisições
- registrar uma refeição feita
- editar uma refeição, podendo alterar todos os dados acima
- apagar uma refeição
- listar todas as refeições de um usuário
- visualizar uma única refeição
- recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
- O usuário só pode visualizar, editar e apagar as refeições as quais ele criou

## Tecnologias utilizadas
- Fastify
- Knex
- TypeScript
- SQLite
- Vitest

## Como rodar o projeto
O projeto já vem configurado para utilizar um banco SQLite, sendo assim basta rodar o comando abaixo:
```sh
npm run dev
```
A aplicação deve estar disponível para receber requisições em http://localhost:3333 (ou na porta que você definir no arquivo .env)

## Rotas
```
[POST] /register - cadastra um novo usuário
[POST] /login - faz login com um usuário previamente criado

[GET] /meals - lista todas as refeições de um usuário
[POST] /meals - cadastra uma nova refeição
[GET] /meals/:id - lista os detalhes de uma refeição
[PUT] /meals/:id - edita as informações de uma refeição
[DELETE] /meals/:id - deleta um refeição
[GET] /meals/metrics - lista as métricas de um usuário
```