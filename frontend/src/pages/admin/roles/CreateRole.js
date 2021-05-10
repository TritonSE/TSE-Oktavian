import React from "react";

import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";

import PageContainer from "../../../components/PageContainer";
import { withAuthorization } from "../../../components/HOC";
import LoadingContainer from "../../../components/LoadingContainer";
import RolePermissionCard from "../../../components/RolePermissionsCard";

const CreateRole = () => {
  const defaultPermissions = {
    view_roster: false,
    recruitment: false,
    final_review: false,
    admin: false,
  };

  const state = {
    loading: false,
    role: { permissions: defaultPermissions },
    permissions: {
      ...defaultPermissions,
      edit_project: false,
      create_project: false,
      manage_role: false,
      activate_accounts: false,
    },
  };

  return (
    <>
      <Helmet>
        <title>Create Role — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container alignItems="center" justify="center">
            <RolePermissionCard role={state.role} mode="create" />
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(CreateRole, true, ["admin"]);
