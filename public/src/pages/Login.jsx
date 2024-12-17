import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import './style.css'; // Ensure this is the correct path to your CSS file

function Auth() {
  const [cookies] = useCookies(["cookie-name"]);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register form
  const [values, setValues] = useState({ email: "", password: "", username: "" });

  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = isLogin ? "http://localhost:4000/login" : "http://localhost:4000/register";
    try {
      const { data } = await axios.post(url, { ...values }, { withCredentials: true });
      if (data) {
        if (data.errors) {
          const { email, password, username } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
          else if (username) generateError(username);
        } else {
          navigate("/");
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="main">
      <input type="checkbox" id="chk" aria-hidden="true" checked={!isLogin} onChange={() => setIsLogin(!isLogin)} />

      {/* Signup Form */}
      <div className="signup">
      <form onSubmit={handleSubmit}>
          <label htmlFor="chk" aria-hidden="true">Login</label>
          {isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
              />
            </>
          )}
          <button type="submit">{isLogin ? "Login" : "Sign up"}</button>
        </form>
        
      </div>

      {/* Login Form */}
      <div className="login">
      <form onSubmit={handleSubmit}>
          <label htmlFor="chk" aria-hidden="true">Sign Up</label>
          {!isLogin && (
            <>
              
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          />
          <button type="submit">{isLogin ? "Login" : "Sign up"}</button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Auth;
