/**
 * Functions that are called by the backend routes to make
 * various queries on the database
 *
 * @summary Functions to interact with the Mongo Database
 */
const { Project } = require("../models");

/**
 * Returns all projects.
 */
async function getAllProjects() {
  return Project.find();
}

/**
 * Returns an array of projects that the user is a contributor to.
 */
async function getUserProjects(user_id) {
  return Project.find().or([
    {
      project_manager: user_id,
    },
    {
      outreach: user_id,
    },
    {
      designers: user_id,
    },
    {
      developers: user_id,
    },
  ]);
}

/**
 * Returns project object corresponding to given project id.
 *
 * @param {ObjectId} project_id - Id of the project to return
 * @returns {JSON} - Project corresponding to the project id or null if no such project exists
 */
async function getOneProject(project_id) {
  return Project.findById(project_id);
}

/**
 * Stores the given project in the database.
 *
 * @param {JSON} project - Project object to be added to the database
 * @returns {JSON} - The stored project
 */
async function addProject(project) {
  return new Project(project).save();
}

module.exports = {
  getAllProjects,
  getUserProjects,
  getOneProject,
  addProject,
};
