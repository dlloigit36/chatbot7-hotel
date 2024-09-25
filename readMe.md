# This project consisted of
1. postgresql database inside folder "project-d". Some sample guest_request was inserted manually for testing purpose. It should come from another source.
2. api module inside folder "api-h" as back-end module to create/read/update/delete database record
3. web module inside folder "web-h" as front-end user interface

# To run this application, only Docker engine needed
1. go to folder ./project-d
2. run docker compose up -d
3. access with browser URL http://localhost:3017/
4. to stop run docker compose down inside ./project-d folder

# Notes
1. file sample-query.sql with some sql command to create database and other CRUD operation command.