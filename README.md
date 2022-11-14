# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Setup

Since .env files are gitignored, to start using this repo you will need to create your own **.env.test** and **.env.development** files in order to connect to the databases locally.

In the .env.test file you will need

```
PGDATABASE=test_database_name_here
```

In the .env.development file you will need

```
PGDATABASE=database_name_here
```
