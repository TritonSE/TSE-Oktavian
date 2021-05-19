import React from "react";

import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";

import PageContainer from "../../../components/PageContainer";
import { withAuthorization } from "../../../components/HOC";
import LoadingContainer from "../../../components/LoadingContainer";
import RolePermissionCard from "../../../components/RolePermissionsCard";

const CreateRole = () => {
  const defaultPermissions = {
    roster: false,
    recruitment: false,
    final_approval: false,
    roster_edit: false,
    project_edit: false,
    project_create: false,
    role_management: false,
    account_activation: false,
  };

  const state = {
    loading: false,
    role: { name: "", permissions: defaultPermissions },
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

export default withAuthorization(CreateRole, true, ["role_management"]);
