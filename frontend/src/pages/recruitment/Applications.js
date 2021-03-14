import React from "react";
import WithAuthentication from "../../components/WithAuthentication";
import PageContainer from "../../components/PageContainer";
import LoadingContainer from "../../components/LoadingContainer";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-table/core";
import { TableIcons } from "../../components/Icons";
import { useDispatch } from "react-redux";
import { openAlert } from "../../actions";
import { getApplications } from "../../services/applications";

const useStyles = makeStyles(() => ({
  grid: {
    textAlign: "center",
  },
}));

export default function Applications() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    loading: true,
    applications: [],
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadData = async () => {
      let { ok, data } = await getApplications();
      if (ok) {
        const applications = data.applications.map((app) => {
          return {
            ...app,
            role: app.role.name,
            submission: new Date(app.created_at).getFullYear(),
          };
        });
        setState({
          ...state,
          loading: false,
          applications: applications,
        });
      } else {
        dispatch(openAlert(`Error: ${data.message}`));
        setState({
          ...state,
          loading: false,
        });
      }
    };
    if (state.loading) {
      loadData();
    }
  }, [state.loading]);

  return (
    <WithAuthentication allow={true}>
      <Helmet>
        <title>All Applications — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            className={classes.grid}
          >
            <Grid item xs={12}>
              <MaterialTable
                icons={TableIcons}
                actions={[
                  {
                    icon: function visibility() {
                      return <Visibility />;
                    },
                    tooltip: "View Application",
                    onClick: (event, row) => {
                      let origin =
                        window.location.protocol +
                        "//" +
                        window.location.hostname +
                        (window.location.port
                          ? ":" + window.location.port
                          : "");
                      window.open(
                        `${origin}/recruitment/application/${row._id}`
                      );
                    },
                  },
                ]}
                options={{
                  filtering: true,
                  paging: true,
                  pageSize: 10,
                  emptyRowsWhenPaging: true,
                  pageSizeOptions: [10, 20, 50, 100],
                }}
                columns={[
                  { title: "Name", field: "name" },
                  { title: "Email", field: "email" },
                  { title: "Position", field: "role" },
                  { title: "Stage", field: "current_stage" },
                  {
                    title: "Graduating In",
                    field: "graduation",
                    type: "numeric",
                  },
                  {
                    title: "Submitted In",
                    field: "submission",
                    type: "numeric",
                  },
                  { title: "Completed", field: "completed", type: "boolean" },
                  { title: "Accepted", field: "accepted", type: "boolean" },
                ]}
                data={state.applications}
                title="All Applications"
              />
            </Grid>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </WithAuthentication>
  );
}
