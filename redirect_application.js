function redirectApplication(query, newRole) {
  const applications = db.applications.find(query).toArray();
  if (applications.length !== 1) {
    return `Query matched ${applications.length} applications (expected 1)`;
  }
  const application = applications[0];
  const fields = ["name", "email", "start_quarter", "start_year", "graduation_quarter", "graduation_year", "resume", "about", "why"];

  const applicationData = {};
  applicationData["role"] = newRole;
  for (const field of fields) {
    applicationData[field] = application[field];
  }
  return JSON.stringify(applicationData);
}
