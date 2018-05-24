# Schooled Lunch
Yet another recipe website.

## Docker Setup for Development
First time setup: 
`docker-compose build` 

Start the live-reloading dev server:
`docker-compose up`

## Installing Node Modules with Docker
Installing via Docker ensures container uses correct dependencies:
`docker-compose run --rm app yarn add <package name>`

## Running Tests
`docker-compose run --rm app yarn test`
or
`docker-compose run --rm app yarn test:watch`

## Database
To seed the database:
`docker-compose run --rm app yarn seed`

Use when server is running to view data:
`docker-compose exec mongo mongo`
