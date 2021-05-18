import React, { useState, useEffect } from "react";
import FolderOpen from "@material-ui/icons/FolderOpen";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { useDispatch } from "react-redux";
import { Card, CardContent, Grid, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { openAlert } from "../actions";
import { getProjects } from "../services/projects";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  card: {
    maxWidth: 440,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  projectContainer: {
    border: "1px solid #8A8A8A",
    borderRadius: 3,
    padding: theme.spacing(2),
    cursor: "pointer",
  },
  projectHeader: {
    flexWrap: "nowrap",
    marginBottom: theme.spacing(1),
  },
  fileLabel: {
    color: "#3386E7",
    textDecoration: "underline",
  },
  fileIcon: {
    marginRight: 12,
  },
  label: {
    color: "#8A8A8A",
    marginBottom: theme.spacing(1),
    fontWeight: 400,
  },
}));

const File = ({ file }) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" alignItems="center">
      <FolderOpen className={classes.fileIcon} />
      <Link href={file.link} target="_blank" className={classes.fileLabel}>
        {file.name}
      </Link>
    </Grid>
  );
};

const Project = ({ project }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Grid container className={classes.projectContainer}>
        <Grid container direction="row" justify="space-between" className={classes.projectHeader}>
          <Typography noWrap>{project.name}</Typography>
          <ArrowForward />
        </Grid>
        {project.files.map((file) => (
          <File file={file} />
        ))}
      </Grid>
    </Grid>
  );
};

const ProjectsList = ({ label, projects }) => {
  const classes = useStyles();

  return (
    <Grid item container direction="column" alignItems="flex-start">
      <Typography className={classes.label}>{label}</Typography>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Project project={project} />
        ))}
      </Grid>
    </Grid>
  );
};

const ProjectsCard = ({ user }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: true,
    currentProjects: [],
    completeProjects: [],
  });

  useEffect(() => {
    const loadCard = async () => {
      const { ok, data } = await getProjects(user);
      if (ok) {
        const currentProjects = data.projects.filter(
          (project) => project.phase !== "Post Development"
        );
        const completeProjects = data.projects.filter(
          (project) => project.phase === "Post Development"
        );
        setState({
          ...state,
          loading: false,
          currentProjects,
          completeProjects,
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
      loadCard();
    }
  }, []);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} variant="h5">
          Projects
        </Typography>
        <Grid container spacing={3}>
          {state.currentProjects.length > 0 && (
            <ProjectsList label="Current" projects={state.currentProjects} />
          )}
          {state.completeProjects.length > 0 && (
            <ProjectsList label="Complete" projects={state.completeProjects} />
          )}
          {state.currentProjects.length === 0 && state.completeProjects.length === 0 && (
            <Grid item container justify="center">
              <Typography variant="h6">No projects yet!</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
