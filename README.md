# Northcoders House of Games API

# Link

The project is live [here](https://strange-lime-buffalo.cyclic.app/).

# Summary

The purpose of this repo is to mimic the building of a real world backend service which should provide information to the front end architecture.

The database will be made in psql and interacted with node-postgres.

# Getting Started

## 1. Clone this repo.

```

git clone https://github.com/26june/nc-games-project.git

```

## 2. Install the required dependencies.

The `package.json` file contains the following dependencies:

```yaml

"dependencies":  {

"dotenv":  "^16.0.0",

"express":  "^4.18.2",

"jest-sorted":  "^1.0.14",

"pg":  "^8.7.3",

"pg-format":  "^1.0.4"

},

"devDependencies":  {

"husky":  "^8.0.0",

"jest":  "^27.5.1",

"jest-extended":  "^2.0.0",

"supertest":  "^6.3.1"

}

```

In order to install these, run the code:

```

npm install

```

## 3. Seed the local database

First, create the databases using the script provided in the `package.json` file.

```

npm run setup-dbs

```

<br>

Since .env files are gitignored, to start using this repo you will need to create your own `.env.test` and `.env.development` files in order to connect to the databases locally.

The `.env.development` file should contain:

```

PGDATABASE=database_name_here

```

The `.env.test` file should contain:

```

PGDATABASE=test_database_name_here

```

The correct database names can be found in `/db/setup.sql`.

<br>

Next, seed the databases.

```

npm run seed

```

<br>

Lastly, run the tests.

```

npm test

```

## Notes

This project was built using:

`Node.js v18.10.0.`

`pg 8.7.3`

`psql 14.5`
