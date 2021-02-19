# Oktavian

TODO: Cleanup

---

# Frontend

Frontend server written in React to manage our recruitment pipeline.

## Setup

Dependencies you'll need:
* Node 12+
* NPM 6+

Run the following commands:

```
npm install
npm start
```

This will start a development server at **localhost:3000**. 
By default, this server will assume the backend is hosted at **localhost:8000**.
This can be changed using the `REACT_APP_BACKEND_URL` environment variable.

To produce a production build, use:

```
npm run build
```

---

# Backend

Backend for our recruitment software.

## Setup

Dependencies you'll need:
* Node 12+
* NPM 6+

Run the following commands:

```
npm install
npm start
```

This will start a backend development server at **localhost:8000**. Note that 
you must specify a MongoDB database through the `MONGO_URI` envvar, used to 
keep track of application data. You will also need to provide an email through
the `EMAIL_USER` and `EMAIL_PASS` environment variables.

## Adminstrative Scripts

There is also a collection of Python scripts under the `scripts` folder that
connect directly to the MongoDB database and should be used for administrative
purposes. This includes features such as modifying user roles, re-assigning
application reviews, and others.

To use:

```
pip install -r scripts/requirements.txt
MONGO_URI=[DATABASE URL] python scripts/[SCRIPT NAME] [ADDITIONAL ARGUMENTS ...]
```
