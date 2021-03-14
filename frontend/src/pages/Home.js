import React from "react";
import AuthenticationResolver from "../components/AuthenticationResolver";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const loginState = useSelector((state) => state.login);
  if (loginState.loading) {
    return <AuthenticationResolver />;
  }
  return loginState.authenticated ? (
    <Redirect to="/recruitment" />
  ) : (
    <Redirect to="/login" />
  );
}
