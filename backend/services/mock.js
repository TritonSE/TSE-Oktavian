const { User, Role, Committee } = require("../models");

async function createMockData() {
  // Roles
  const public_role = new Role({
    name: "Developer",
    permissions: {
      recruitment: false,
      admin: false,
      final_approval: false,
    },
  });
  await public_role.save();
  const private_role = new Role({
    name: "Project Manager",
    permissions: {
      recruitment: true,
      admin: false,
      final_approval: false,
    },
  });
  await private_role.save();
  const admin_role = new Role({
    name: "President",
    permissions: {
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
  const public_committee = new Committee({
    role: public_role._id,
    reviewers: [private_user._id, admin_user._id],
  });
  await public_committee.save();
}

module.exports = {
  createMockData,
};
