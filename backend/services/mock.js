const { User, Role, ApplicationPipeline, Project } = require("../models");

async function createMockData() {
  // Roles
  const alum_role = new Role({
    name: "Alum",
    permissions: {},
  });
  await alum_role.save();
  const unassigned_role = new Role({
    name: "Unassigned",
    permissions: {
      roster: true,
    },
  });
  await unassigned_role.save();
  const designer_role = new Role({
    name: "Designer",
    permissions: {
      roster: true,
      recruitment: true,
    },
  });
  await designer_role.save();
  const developer_role = new Role({
    name: "Developer",
    permissions: {
      roster: true,
      recruitment: false,
    },
  });
  await developer_role.save();
  const project_manager_role = new Role({
    name: "Project Manager",
    permissions: {
      roster: true,
      recruitment: true,
    },
  });
  await project_manager_role.save();
  const pvp_role = new Role({
    name: "PVP",
    permissions: {
      roster: true,
      recruitment: true,
      admin: true,
    },
  });
  await pvp_role.save();
  const president_role = new Role({
    name: "President",
    permissions: {
      roster: true,
      recruitment: true,
      admin: true,
      final_approval: true,
      role_management: true,
    },
  });
  await president_role.save();

  // Users
  const developer_user = new User({
    email: "developer@example.com",
    password: "password",
    name: "Example Developer",
    graduation: 2020,
    linkedin_username: "Example LinkedIn",
    discord_username: "example#1234",
    github_username: "Example Github",
    phone: "(555) 555-5555",
    role: developer_role._id,
    active: true,
  });
  await developer_user.save();
  const project_manager_user = new User({
    email: "pm@example.com",
    password: "password",
    name: "Example PM",
    graduation: 2020,
    linkedin_username: "Example LinkedIn",
    discord_username: "example#1234",
    github_username: "Example Github",
    phone: "(555) 555-5555",
    role: project_manager_role._id,
    active: true,
  });
  await project_manager_user.save();
  const president_user = new User({
    email: "president@example.com",
    password: "password",
    name: "Example President",
    graduation: 2020,
    linkedin_username: "Example LinkedIn",
    discord_username: "example#1234",
    github_username: "Example Github",
    phone: "(555) 555-5555",
    role: president_role._id,
    active: true,
  });
  await president_user.save();

  // Projects
  const cool_project = new Project({
    name: "Cool Project",
    description: "This is a cool project.",
    client: "TSE",
    phase: "Development",
    timeline: {
      start: {
        quarter: "Fall",
        year: 2020,
      },
    },
    project_manager: project_manager_user._id,
    outreach: president_user._id,
    designers: [president_user._id, project_manager_user._id],
    developers: [developer_user._id],
    files: [
      {
        link: "https://example.com",
        name: "Cool File 1",
      },
      {
        link: "https://example.com",
        name: "Cool File 2",
      },
    ],
  });
  await cool_project.save();

  const cooler_project = new Project({
    name: "Cooler Project",
    description: "This project is cooler than the other.",
    client: "TSE",
    phase: "Outreach",
    timeline: {
      start: {
        quarter: "Spring",
        year: 2021,
      },
    },
    project_manager: project_manager_user._id,
    outreach: president_user._id,
    files: [
      {
        link: "https://example.com",
        name: "Cool File 1",
      },
      {
        link: "https://example.com",
        name: "Cool File 2",
      },
    ],
  });
  await cooler_project.save();

  const coolest_project = new Project({
    name: "Coolest Project",
    description: "This project is the coolest.",
    client: "TSE",
    phase: "Post Development",
    timeline: {
      start: {
        quarter: "Fall",
        year: 2010,
      },
      end: {
        quarter: "Spring",
        year: 2014,
      },
    },
    project_manager: project_manager_user._id,
    outreach: president_user._id,
    designers: [president_user._id, project_manager_user._id],
    developers: [developer_user._id, president_user._id],
    files: [
      {
        link: "https://example.com",
        name: "Cool File 1",
      },
      {
        link: "https://example.com",
        name: "Cool File 2",
      },
      {
        link: "https://example.com",
        name: "Cool File 3",
      },
    ],
  });
  await coolest_project.save();

  // Commitees
  const public_pipeline = new ApplicationPipeline({
    role: developer_role._id,
    reviewers: [project_manager_user._id, president_user._id],
  });
  await public_pipeline.save();
}

module.exports = {
  createMockData,
};
