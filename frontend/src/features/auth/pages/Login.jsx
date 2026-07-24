import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setemail] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await handleLogin({ email, password });
    navigate("/");
  } catch (err) {
    console.error(err);
  }
};
  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    )
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-grp">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setemail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email Address"
            />
          </div>

          <div className="input-grp">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
            />
          </div>

          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
