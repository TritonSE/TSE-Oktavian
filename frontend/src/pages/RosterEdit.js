import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../components/PageContainer";
import LoadingContainer from "../components/LoadingContainer";
import { withAuthorization } from "../components/HOC";
import { openAlert } from "../actions";
import UserEdit from "../components/UserEdit";
import { getUser } from "../services/users";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "90%",
    },
    "& .MuiButton-root": {},
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  lightSpacing: {
    margin: theme.spacing(1),
    width: "100%",
  },
  card: {
    maxWidth: 440,
  },
  button: {
    maxWidth: 200,
    color: "black",
    textTransform: "none",
  },
}));

const RosterEdit = ({ match }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    loading: true,
    userData: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      const userRes = await getUser(match.params.userid);
      if (userRes.ok) {
        setState({
          loading: false,
          userData: userRes.data,
        });
      } else {
        dispatch(openAlert(`Error: ${userRes.data.message}`));
      }
    };
    loadUser();
  }, []);

  return (
    <>
      <Helmet>
        <title>Edit Roster — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          justify="center"
          className={classes.grid}
        >
          <Grid item md={4} xs={6}>
            <LoadingContainer loading={state.loading}>
              {state.loading || <UserEdit userData={state.userData} />}
            </LoadingContainer>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};

export default withAuthorization(RosterEdit, true, ["user_edit"]);
