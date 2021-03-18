const { User, Role, Committee } = require("../models");

async function createMockData() {
  // Roles
  const public_role = new Role({
    name: "Developer",
    permit_regular_review: false,
    permit_admin: false,
    permit_final_review: false,
  });
  await public_role.save();
  const private_role = new Role({
    name: "Project Manager",
    permit_regular_review: true,
    permit_admin: false,
    permit_final_review: false,
  });
  await private_role.save();
  const admin_role = new Role({
    name: "President",
    permit_regular_review: true,
    permit_admin: true,
    permit_final_review: true,
  });
  await admin_role.save();

  // Users
  const public_user = new User({
    email: "developer@tse.ucsd.edu",
    password: "password",
    name: "Test Developer",
    role: public_role._id,
    active: true,
  });
  await public_user.save();
  const private_user = new User({
    email: "pm@tse.ucsd.edu",
    password: "password",
    name: "Test PM",
    role: private_role._id,
    active: true,
  });
  await private_user.save();
  const admin_user = new User({
    email: "president@tse.ucsd.edu",
    password: "password",
    name: "Test President",
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
