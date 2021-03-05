import React from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

export default function Home() {
  return isAuthenticated() ? (
    <Redirect to="/dashboard" />
  ) : (
    <Redirect to="/login" />
  );
}
