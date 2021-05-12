import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import MaterialTable from "@material-table/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Helmet } from "react-helmet";
import { Visibility } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { TableIcons } from "../../components/Icons";
import LoadingContainer from "../../components/LoadingContainer";
import PageContainer from "../../components/PageContainer";
import { getApplications } from "../../services/applications";
import { withAuthorization } from "../../components/HOC";
import { getApplicationReviews } from "../../services/reviews";

const Applications = () => {
  const [state, setState] = React.useState({
    // Initial backend data
    loading: true,
    applications: [],
    // User input
    start_date: new Date(new Date().getFullYear(), new Date().getMonth() - 9, new Date().getDate()),
    end_date: new Date(),
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadData = async () => {
      const { ok, data } = await getApplications(state.start_date, state.end_date, true);
      if (ok) {
        const applications = data.applications.map((app) => ({
          ...app,

          role: app.role.name,
        }));
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
          applications,
        }));
      } else {
        setState((prev_state) => ({
          ...prev_state,
          loading: false,
        }));
      }
    };
    if (state.loading) {
      loadData();
    }
    const loadReviews = async () => {
      const reviews = state.applications.map((x) => x);
      let i;
      /* eslint-disable no-await-in-loop */
      for (i = 0; i < reviews.length; i++) {
        const curr = i;
        const review_list = await getApplicationReviews(reviews[curr]._id);
        review_list.data.reviews.sort((a, b) => a.created_at - b.created_at);
        reviews[curr][
          "resume_rating"
        ] = `${review_list.data.reviews[0].reviewer.name}: ${review_list.data.reviews[0].rating}/5`;
        reviews[curr][
          "phone_rating"
        ] = `${review_list.data.reviews[1].reviewer.name}: ${review_list.data.reviews[1].rating}/5`;
        reviews[curr][
          "interview_rating"
        ] = `${review_list.data.reviews[2].reviewer.name}: ${review_list.data.reviews[2].rating}/5`;
      }

      setState((prev_state) => ({
        ...prev_state,
        loading: false,
        reviews,
      }));
    };
    loadReviews();
  }, [state.applications, state.loading, state.start_date, state.end_date, dispatch]);
  return (
    <>
      <Helmet>
        <title>Final Applications — TSE Oktavian</title>
      </Helmet>
      <PageContainer>
        <LoadingContainer loading={state.loading}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} />
          <MaterialTable
            icons={TableIcons}
            actions={[
              {
                icon: function visibility() {
                  return <Visibility />;
                },
                tooltip: "View Application",
                onClick: (event, row) => {
                  const origin = `${window.location.protocol}//${window.location.hostname}${
                    window.location.port ? `:${window.location.port}` : ""
                  }`;
                  window.open(`${origin}/recruitment/application/${row._id}`);
                },
              },
            ]}
            options={{
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: true,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            columns={[
              { title: "Name", field: "name" },
              { title: "Email", field: "email" },
              { title: "Position", field: "resume" },
              { title: "Position", field: "role" },
              { title: "Graduation", field: "graduation" },
              { title: "Resume", field: "resume_rating" },
              { title: "Phone", field: "phone_rating" },
              { title: "Interview", field: "interview_rating" },
            ]}
            data={state.applications}
            title="Final Applications "
          />
        </LoadingContainer>
      </PageContainer>
    </>
  );
};

export default withAuthorization(Applications, true, ["recruitment"]);
