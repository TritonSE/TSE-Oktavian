import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, Typography, Button } from "@material-ui/core";

import PageContainer from "../../../components/PageContainer";
import { withAuthorization } from "../../../components/HOC";
import LoadingContainer from "../../../components/LoadingContainer";
import { openAlert } from "../../../actions";
import { getRoles } from "../../../services/roles";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 400,
    padding: 20,
  },
  createRoleBtnCont: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  roleCont: {
    marginTop: theme.spacing(1),
  },
}));

const Roles = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [state, setState] = useState({
    loading: true,
    roles: [],
  });

  useEffect(() => {
    const loadRoles = async () => {
      const roles_res = await getRoles();

      if (roles_res.ok) {
        setState({
          ...state,
          loading: false,
          roles: roles_res.data.roles,
        });
      } else {
        dispatch(openAlert(`Error: ${roles_res.data.message}`));
        setState({
          ...state,
          loading: false,
        });
      }
    };

    if (state.loading) {
      loadRoles();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>All Roles — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid container justify="flex-end" className={classes.createRoleBtnCont}>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                event.preventDefault();

                // TODO - Redirect to new page to create a new role
              }}
            >
              + Create Role
            </Button>
          </Grid>
          <Grid container alignItems="center" justify="center">
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h4">Current Roles</Typography>
                {state.roles.map((role) => (
                  <Grid
                    key={role._id}
                    container
                    direction="row"
                    className={classes.roleCont}
                    alignItems="center"
                  >
                    <Grid item xs={9}>
                      <Typography>{role.name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(event) => {
                          event.preventDefault();

                          // TODO - Redirect to page to edit existing role
                          history.push(`/admin/roles/edit/${role._id}`);
                          console.log(`TODO - edit role ${role.name} (${role._id})`);
                        }}
                      >
                        Edit
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Roles, true, ["admin"]);
