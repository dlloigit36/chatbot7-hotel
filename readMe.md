# This project consisted of
1. postgresql database inside folder "project-d". Some sample guest_request was inserted manually for testing purpose. It should come from another source.
2. api module inside folder "api-h" as back-end module to create/read/update/delete database record
3. web module inside folder "web-h" as front-end user interface

# To run this application, only Docker engine needed
1. go to folder ./project-d
2. run "docker compose up -d"
3. access with browser URL http://localhost:3017/
4. to stop run "docker compose down" inside ./project-d folder

# run for first time
1. database is created but not tables.
2. need to manually create Postgresql tables with sql script "create-table.sql". You need pgAdmin to connect to docker postgresql container (exposed on port 5432), with hostname (localhost), username, and password as defined in ./project-d/docker-compose.yml under "postgres-h" > environment.
3. manually insert database data with samples from "guest-request-sample.sql"

# Notes
1. file sample-query.sql with some sql command to create database and other CRUD operation command.
2. manually create tables in hotel database run "create-table.sql" with pgadmin query tool.
3. manually create some guest_request run INSERT command in "guest-request-sample.sql" with pgadmin query tool.