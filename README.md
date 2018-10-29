# Schooled Lunch

Yet another recipe website.

## Docker Setup for Development

First time setup:
`docker-compose build`

Start the live-reloading dev server:
`docker-compose up`

## Installing Node Modules with Docker

Installing via Docker ensures container uses correct dependencies:
`docker-compose run --rm app npm install <package name>`

## Running Tests

`docker-compose run --rm app npm run test`
or
`docker-compose run --rm app npm run test:watch`

## Database

To seed the database:
`docker-compose run --rm app npm run seed`

Use when server is running to view data:
`docker-compose exec mongo mongo`

## Editor Configuration

Recommended VSCode project settings. Copy and paste the following json to `.vscode/settings.json`

```json
{
  "css.validate": false,
  "editor.formatOnSave": true,
  "javascript.format.enable": false,
  "prettier.eslintIntegration": true,
  "prettier.stylelintIntegration": true
}
```

Recommended VSCode extensions:

- Prettier
- Stylelint
- Eslint
- EditorConfig
