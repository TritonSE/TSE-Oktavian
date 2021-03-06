# Oktavian

Oktavian is our planned, one-stop shop HR application, intended to handle everything from 
recruitment to roster management to project logistics. Oktavian supersedes our previous
recruitment tool project, which only focused on the immediate recruitment pipeline
and did not extend past that.

The frontend is written in React, which is bundled and served directly by the backend.
The backend is written using a combination of NodeJS, Express, and MongoDB (the MERN stack).

## Features

The ideal feature list is given as:

* Manages the recruitment pipeline
    * Applications submitted through the website are sent to Oktavian.
    * Oktavian auto-assigns the application to a reviewer.
    * The reviewer can guide the application through several pre-defined stages.
    * The application is either accepted or rejected at the end.
    * Oktavian handles applicant notification when a decision is made.
    * Oktavian allows you to search for the details of any application.
    * Oktavian presents you with a clean interface for viewing your own assignments.
* Manages the organization roster
    * Upon acceptance of an application, a developer/designer/PM profile is generated.
    * The executive board can create/edit/delete 1 or more project teams.
    * The executive board can assign each developer/designer/PM to a team.
    * Each developer/designer/PM can view/edit information about themselves. 
    * Each developer/designer/PM can view information about their team. 
    * Oktavian presents a clean interface to all users for viewing members & groups in the club.
    * Oktavian presents a promotion ladder to the executive board.
    * Oktavian allows inactive members to be deleted by the executive board.
    * Oktavian has an alumni section for contacting graduated members.
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
* (optional, defaults to 'keyboard cat') SESSION_SECRET = used to uniquely identifying server sessions, must be changed in production
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
