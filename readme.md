# Actinium

[![Greenkeeper badge](https://badges.greenkeeper.io/Atomic-Reactor/Actinium.svg)](https://greenkeeper.io/)

A framework for building web applications using Node + Express and MongoDB with the Parse Server SDK.

## Quick Start

Actinium relies on MongoDB as it's database service. You will need to set up a local instance for development purposes.
You can install MongoDB however you wish, but [Homebrew](https://brew.sh/) is an easy way.

```
$ brew install mongodb
```

Next you'll want to run the database as a service.

```
$ brew services start mongodb
```

### Create the admin db user

If this is your first time running MongoDB locally, you'll need to create the admin user account as well as your application database and admin user.

In terminal input the following MongoDB commands (be sure to replace PASSWORD with the actual password you wish to use):

```
$ mongo
$ use admin
$ db.createUser({user:"dbadmin", pwd:"PASSWORD", roles:[{role:"root", db:"admin"}]})
```

### Create the actinium db user
```
$ use actinium
$ db.createUser({user:"dbadmin", pwd:"PASSWORD", roles:["readWrite"]})
$ exit
```

Installing Actinium is super easy. Simply install the [Atomic Reactor CLI:](https://www.npmjs.com/package/atomic-reactor-cli)

```
npm install -g atomic-reactor-cli
```

Change directory to where you want to install Actinium

```
$ cd /Your/project/actinium
```

Run the install command.

```
$ arcli actinium install
```

Install dependencies

```
$ npm install
```

Run the local environment

```
$ npm run local
```

# Configuration

Actinium has a pretty slim configuration that can be set via the `~/src/env.json` file or environment variables.

###### Default Config:

```json
{
    "APP_ID": "Actinium",
    "APP_NAME": "Actinium",
    "APP_PORT": 9000,
    "DATABASE_URI": "mongodb://actinium:NyM8TedbT4NlM67H@localhost:27017/actinium",
    "SERVER_URI": "http://localhost:9000",
    "PUBLIC_SERVER_URI": "http://localhost:9000",
    "MASTER_KEY": "VVipSwUXCp7p08vMDREITClNWG9oUSxBl2gDWL0Ffo",
    "LOG": true,
    "NO_PARSE": false,
    "NO_DOCS": false,
    "PARSE_DASHBOARD": true,
    "PARSE_DASHBOARD_MOUNT": "/parse",
    "PARSE_DASHBOARD_USERS": [
        {
            "user": "admin",
            "pass": "admin"
        }
    ],
    "PARSE_MOUNT": "/api"
}
```

### Server Configuration:

By creating an alternate `env.json` file named: `env.remote.json` and setting the environment variable `ACTINIUM_ENV_ID` to `remote` the `env.remote.json` file will be used instead of the default `env.json` file.

# Cloud Functions

The main usage of Actinium is a framework for creating Parse Cloud Functions. Cloud Functions are saved to the `~/src/app/cloud` directory.

## Creating a Cloud Function

```
$ arcli cloud -d cloud/user/create.js
```

> See: [Cloud Code Guide](https://docs.parseplatform.org/cloudcode/guide/) for more details on how to write Cloud Functions

# Customizing

Actinium is designed to be modular and customizable via Express middleware.

When Actinium starts up, it will scan the `~/src/app` directory for `middleware.js` files.

The `middleware.js` file should export an object with the following properties:

### order { Number }

Where in the middleware stack the module is to be executed.

### middleware { Array }

Array of Express middleware functions or routers.

###### Example Middleware:

```javascript
const express = require('express');

const router = express.Router();
router.get('/sample', (req, res) => {
    res.send('hello bruh!');
});

module.exports = {
    order: 10000,
    middleware: [router],
};
```

> **_Note:_** The console will output the load of each middleware as they are ordered.

# Globals

#### BASE_DIR { String }

Path to the Actinium root directory.

#### SRC_DIR { String }

Path to the `~/src` directory.

#### APP_DIR { String }

Path to the `~/src/app` directory.

#### ACTINIUM_DIR { String }

Path to the `~/.core` directory.

#### ENV { Object }

Environmental settings supplied by the `~/src/env.json` file merged with `process.env` values.

#### PORT { Number }

The running port for Actinium.

#### LOG { Function }

Function that executes a `console.log()` but with Actinium's pretty formatting.

# Documenting your Cloud Functions

Actinium generates a `/docs` endpoint where you can view documentation related to your cloud functions.

> The docs are generated from code comments in the [APIDOC](http://apidocjs.com/) format.

###### Example Doc Block:

```javascript
/**
 * @api {post} /functions/hello
 * @apiVersion 0.1.0
 * @apiGroup Example
 * @apiName hello
 * @apiDescription Hello World cloud function.
 *
 * @apiParam {String} msg The hello message.
 *
 * @apiExample {js} Example Usage:
 * const sayHello = async ({ msg }) => {
 *   const output = await Parse.Cloud.run('hello', { msg });
 *   console.log(output);
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "msg": "String"
 *  }
 */
```

<img src="https://preview.ibb.co/kcaAQG/atomic_reactor.png" alt="atomic_reactor" border="0" style="width: 100%; height: auto;" />
