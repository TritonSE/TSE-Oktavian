import React, { useEffect, useState } from "react";

import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";

import PageContainer from "../../../components/PageContainer";
import { withAuthorization } from "../../../components/HOC";
import LoadingContainer from "../../../components/LoadingContainer";
import RolePermissionCard from "../../../components/RolePermissionsCard";
import { openAlert } from "../../../actions";
import { getRole } from "../../../services/roles";

const EditRole = ({ match }) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    loading: true,
    role: [],
    permissions: {
      view_roster: false,
      recruitment: false,
      final_review: false,
      admin: false,
      edit_project: false,
      create_project: false,
      manage_role: false,
      activate_accounts: false,
    },
  });

  useEffect(() => {
    const loadRole = async () => {
      const role_res = await getRole(match.params.roleId);

      if (role_res.ok) {
        setState({
          ...state,
          loading: false,
          role: role_res.data.roles,
        });
      } else {
        dispatch(openAlert(`Error: ${role_res.data.message}`));
        setState({
          ...state,
          loading: false,
        });
      }
    };

    if (state.loading) {
      loadRole();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Edit Role — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container alignItems="center" justify="center">
            <RolePermissionCard role={state.role} mode="edit" />
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(EditRole, true, ["role_management"]);
