import React, { useEffect, useState } from "react";

import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { Typography } from "@material-ui/core";

import PageContainer from "../../../components/PageContainer";
import { withAuthorization } from "../../../components/HOC";
import { getUsers } from "../../../services/users";
import { getRoles } from "../../../services/roles";
import LoadingContainer from "../../../components/LoadingContainer";
import { openAlert } from "../../../actions";
import { TableIcons } from "../../../components/Icons";

const useStyles = makeStyles(() => ({
  columnTitle: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const PendingUsers = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [state, setState] = useState({
    loading: true,
    users: [],
  });

  useEffect(() => {
    const loadUsers = async () => {
      const roles_res = await getRoles("Pending");

      if (roles_res.ok) {
        if (roles_res.data.roles.length === 0) {
          dispatch(openAlert("Error: Pending role not found"));
          setState({
            ...state,
            loading: false,
          });

          return;
        }

        const user_res = await getUsers(roles_res.data.roles[0]._id);

        if (user_res.ok) {
          setState({
            ...state,
            loading: false,
            users: user_res.data.users,
          });
        } else {
          dispatch(openAlert(`Error: ${user_res.data.message}`));
        }
      } else {
        dispatch(openAlert(`Error: ${roles_res.data.message}`));
      }
    };

    if (state.loading) {
      loadUsers();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Pending Users — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <MaterialTable
            title="Pending Users"
            icons={{ ...TableIcons, Filter: TableIcons.Search }}
            onRowClick={(evt, currRow) => {
              history.push(`/admin/pending/${currRow._id}`);
            }}
            options={{
              filtering: true,
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: true,
              pageSizeOptions: [10, 20, 50, 100],
              search: false,
            }}
            columns={[
              {
                title: <Typography className={classes.columnTitle}>Name</Typography>,
                field: "name",
                cellStyle: {
                  textAlign: "left",
                  paddingLeft: "50px",
                },
                headerStyle: {
                  textAlign: "left",
                  paddingLeft: "50px",
                  "&hover": {
                    color: "red",
                  },
                },
                filterCellStyle: {
                  textAlign: "left",
                  paddingLeft: "50px",
                },
              },
              {
                title: <Typography className={classes.columnTitle}>Email</Typography>,
                field: "email",
                cellStyle: {
                  textAlign: "left",
                },
                headerStyle: {
                  textAlign: "left",
                },
              },
            ]}
            data={state.users}
          />
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(PendingUsers, true, ["final_approval"]);
