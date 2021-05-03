import React from "react";
import MaterialTable from "@material-table/core";
import { Helmet } from "react-helmet";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { TableIcons } from "../components/Icons";
import LoadingContainer from "../components/LoadingContainer";
import PageContainer from "../components/PageContainer";
import { openAlert } from "../actions";
import { getUsers } from "../services/users";
import { withAuthorization } from "../components/HOC";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  dates: {
    marginBottom: theme.spacing(2),
  },
}));
const alumRole = "Alum";
const styleButton = {
  color: "inherit",
  fontWeight: "900",
  textDecoration: "underline",
  textTransform: "none",
  background: "transparent",
};
const defaultButton = {
  color: "gray",
  fontWeight: "900",
  textTransform: "none",
};

const Roster = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    // Initial backend data
    loading: true,
    developers: [],
    alumni: [],
  });
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [alumniTable, setAlumniTable] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadData = async () => {
      const { ok, data } = await getUsers();
      if (ok) {
        const developers = data.users
          .filter((user) => user.role.name !== alumRole)
          .map((user) => ({
            ...user,
            role: user.role.name,
          }));
        const alumni = data.users
          .filter((user) => user.role.name === alumRole)
          .map((user) => ({
            ...user,
            role: user.role.name,
          }));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
          developers,
          alumni,
        }));
      } else {
        dispatch(openAlert(`Error: ${data.message}`));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
        }));
      }
    };
    if (state.loading) {
      loadData();
    }
  }, [state.loading, dispatch]);

  return (
    <>
      <Helmet>
        <title>TSE Roster</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <Button
            size="large"
            style={alumniTable ? defaultButton : styleButton}
            onClick={() => {
              setAlumniTable(false);
            }}
          >
            Active Members
          </Button>
          <Button
            size="large"
            style={!alumniTable ? defaultButton : styleButton}
            onClick={() => {
              setAlumniTable(true);
            }}
          >
            Alumni
          </Button>
          <Grid container spacing={0} alignItems="center" justify="center" className={classes.grid}>
            <Grid item xs={12}>
              <MaterialTable
                icons={{ ...TableIcons, Filter: TableIcons.Search }}
                onRowClick={(evt, currRow) => setSelectedRow(currRow.tableData.id)}
                options={{
                  rowStyle: (rowData) => ({
                    backgroundColor: selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
                  }),
                  filtering: true,
                  paging: true,
                  pageSize: 15,
                  emptyRowsWhenPaging: true,
                  pageSizeOptions: [15, 30, 60, 100],
                  toolbar: false,
                }}
                columns={[
                  {
                    title: "Name",
                    field: "name",
                    cellStyle: {
                      textAlign: "left",
                      paddingLeft: "50px",
                    },
                    headerStyle: {
                      textAlign: "left",
                      paddingLeft: "50px",
                    },
                    filterCellStyle: {
                      textAlign: "left",
                      paddingLeft: "50px",
                    },
                  },
                  {
                    title: "Role",
                    field: "role",
                    cellStyle: {
                      textAlign: "left",
                    },
                    headerStyle: {
                      textAlign: "left",
                    },
                  },
                  {
                    title: "Graduating In",
                    field: "graduation",
                    cellStyle: {
                      textAlign: "left",
                    },
                    headerStyle: {
                      textAlign: "left",
                    },
                  },
                ]}
                data={alumniTable ? state.alumni : state.developers}
                title=""
              />
            </Grid>
          </Grid>
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Roster, true);
