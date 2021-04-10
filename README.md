# Oktavian

Oktavian is our planned, one-stop shop membership portal application, intended to handle
everything from recruitment to roster management to project logistics. Oktavian supersedes
the previous recruitment tool project, which only focused on the immediate recruitment pipeline.

The goal of Oktavian is two-fold: (1) centralize our most important documents and
data and (2) automate away some of the redundancies associated with our processes. The core
idea behind Oktavian is that of role-based access control. Through Oktavian, users are
assigned to unique roles, each of which has certain permissions. These permissions are
propagated internally throughout Oktavian, controlling what information users are allowed
to see (for example, project-related documents, recruitment-related applications, etc.) and
are propogated externally beyond Oktavian, cascading into the other services that TSE uses,
such as Google Drive, Monday.com, GitHub, and others. Ultimately, a user's entire technological
footprint with respect to TSE will be tied solely to Oktavian.

The frontend is written in React, which is bundled and served directly by the backend.
The backend is written using a combination of NodeJS, Express, and MongoDB (the MERN stack).

## Setup

Dependencies you'll need:

- Node 12+
- NPM 6+
- MongoDB

First, install all Node dependencies:

```
npm install
```

If you are in a production environment, you can perform a one-time build of the frontend.
This will not monitor the frontend directory for changes:

```
npm run build
```

Finally, to start the server:

```
npm start
```

In a development environment, start the server with:

```
npm run start-dev
```

This will install any necessary modules, start the backend server at **localhost:8000** serving
the API routes, and start the frontend server at **localhost:3000** with hot-reloading. Visit **localhost:3000**
to see the app. The frontend server will also automatically proxy API requests to the backend server.

There are several environment variables that must be set for the backend to work:

- (required) MONGO_URI = URI pointing to a MongoDB database
- (optional, defaults to 'tritonse') REGISTER_SECRET = used to only allow members of the executive board to sign up, must be changed in production
- (optional, defaults to 'keyboard cat') JWT_SECRET = used to uniquely identifying tokens, must be changed in production
- (optional, defaults to '') EMAIL_USERNAME = used for automated emailing, disabled if left empty
- (optional, defaults to '') EMAIL_PASSWORD = used for automated emailing, disabled if left empty

The recommended way to specify this environment variables is by creating the
file `backend/.env` and listing the variables there. The `.env` file is not
tracked by git, so it is acceptable to keep some sensitive information there.

## Adminstrative Scripts

There is also a collection of Python scripts under the `backends/scripts` folder that
connect directly to the MongoDB database and should be used for administrative
purposes. This includes features such as modifying user roles, re-assigning
application reviews, and others.

To use:

```
pip install -r scripts/requirements.txt
MONGO_URI=[DATABASE URL] python scripts/[SCRIPT NAME] [ADDITIONAL ARGUMENTS ...]
```
