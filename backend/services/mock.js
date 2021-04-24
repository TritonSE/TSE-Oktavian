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
  const public_role = new Role({
    name: "Developer",
    permissions: {
      roster: true,
      recruitment: false,
      admin: false,
      final_approval: false,
    },
  });
  await public_role.save();
  const private_role = new Role({
    name: "Project Manager",
    permissions: {
      roster: true,
      recruitment: true,
      admin: false,
      final_approval: false,
    },
  });
  await private_role.save();
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
  const admin_role = new Role({
    name: "President",
    permissions: {
      roster: true,
      recruitment: true,
      admin: true,
      final_approval: true,
    },
  });
  await admin_role.save();

  // Users
  const public_user = new User({
    email: "developer@example.com",
    password: "password",
    name: "Example Developer",
    role: public_role._id,
    active: true,
  });
  await public_user.save();
  const private_user = new User({
    email: "pm@example.com",
    password: "password",
    name: "Example PM",
    role: private_role._id,
    active: true,
  });
  await private_user.save();
  const admin_user = new User({
    email: "president@example.com",
    password: "password",
    name: "Example President",
    role: admin_role._id,
    active: true,
  });
  await admin_user.save();

  // Commitees
  const public_pipeline = new ApplicationPipeline({
    role: public_role._id,
    reviewers: [private_user._id, admin_user._id],
  });
  await public_pipeline.save();
}

module.exports = {
  createMockData,
};
