# Oktavian

Oktavian is our planned, one-stop shop membership portal application, intended to handle 
everything from recruitment to roster management to project logistics. Oktavian supersedes 
the previous recruitment tool project, which only focused on the immediate recruitment pipeline.

The frontend is written in React, which is bundled and served directly by the backend.
The backend is written using a combination of NodeJS, Express, and MongoDB (the MERN stack).

## Features

The ideal feature list is given as:

* Manages the recruitment pipeline
    * Applications submitted through the website are sent to Oktavian.
    * Applications are auto-assigned to a reviewer in each stage.
    * Applications are marked as either accepted or rejected at the end.
    * Applicants are notified automatically by email when a decision is made.
    * The board can view the details of any active or past application.
* Manages the organization roster
    * All members will be given a profile, where they can add information about themselves.
    * Members can be assigned to roles, each of which has varying permissions. 
    * Members can be assigned to teams, which tied to a past or ongoing project.
    * Members can view the organization roster, including other members' teams and roles.
    * A promotion ladder is available to the board, where members can be promoted/demoted/removed.
    * Other administrative capabilities are present, such as the ability to create/update roles & teams.
* Manages the project lifecycle
    * Each project team starts with a name, basic description, and list of members.
    * The executive board can fill out the necessary sections of the project proposal attached to the team.
    * The PM can fill out the remaining sections of the project proposal attached to the team.
    * Any member in the organization has access to public information regarding the proposal (e.g. architecture).
    * Sensitive information in the project proposal is hidden (e.g. contacts).

## Setup

Dependencies you'll need:
* Node 12+
* NPM 6+

First, install all Node dependencies:

```
npm install
```

Next, if you are in a development environment, you can start a "watching" service that will continually
rebuild the frontend whenever a change is detected. Note that this service is slightly buggy and may not 
load some pages correctly, particularly with a dynamic URL component. It is recommended that you open
a separate terminal to run the watcher:

```
npm run watch
```

However, if you are in a production environment, you can perform a one-time build of the frontend.
This will not monitor the frontend directory for changes:

```
npm run build
```

Finally, to start the server:

```
npm start
```

This will install any necessary modules, create a production build of the React frontend,
and start a server at **localhost:8000** serving the frontend and API routes.

There are several environment variables that must be set for the backend to work:

* (required) MONGO_URI = URI pointing to a MongoDB database
* (optional, defaults to 'tritonse') REGISTER_SECRET = used to only allow members of the executive board to sign up, must be changed in production
* (optional, defaults to 'keyboard cat') JWT_SECRET = used to uniquely identifying tokens, must be changed in production
* (optional, defaults to '') EMAIL_USERNAME = used for automated emailing, disabled if left empty
* (optional, defaults to '') EMAIL_PASSWORD = used for automated emailing, disabled if left empty

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
