const { User, Role, ApplicationPipeline } = require("../models");

async function createMockData() {
  // Roles
  const alum_role = new Role({
    name: "Alum",
    permissions: {
      roster: false,
      recruitment: false,
      admin: false,
      final_approval: false,
    },
  });
  await alum_role.save();
  const unassigned_role = new Role({
    name: "Unassigned",
    permissions: {
      roster: true,
      recruitment: false,
      admin: false,
      final_approval: false,
    },
  });
  await unassigned_role.save();
  const designer_role = new Role({
    name: "Designer",
    permissions: {
      roster: true,
      recruitment: true,
      admin: false,
      final_approval: false,
    },
  });
  await designer_role.save();
  const developer_role = new Role({
    name: "Developer",
    permissions: {
      roster: true,
      recruitment: false,
      admin: false,
      final_approval: false,
    },
  });
  await developer_role.save();
  const project_manager_role = new Role({
    name: "Project Manager",
    permissions: {
      roster: true,
      recruitment: true,
      admin: false,
      final_approval: false,
    },
  });
  await project_manager_role.save();
  const pvp_role = new Role({
    name: "PVP",
    permissions: {
      roster: true,
      recruitment: true,
      admin: true,
      final_approval: false,
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
