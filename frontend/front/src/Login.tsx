import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

interface LoginFormState {
  email: string;
  password: string;
  errors: {
    email: string;
    password: string;
  };
}

const initialLoginFormState: LoginFormState = {
  email: "",
  password: "",
  errors: {
    email: "",
    password: "",
  },
};

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const Login: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState<LoginFormState>(
    initialLoginFormState
  );
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if (email && password) {
      setRememberMe(true);
      setFormState({
        ...formState,
        email,
        password,
      });
    }
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
      errors: {
        ...formState.errors,
        [name]: "",
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Basic form validation
    let valid = true;
    const newErrors: LoginFormState["errors"] = {
      email: "",
      password: "",
    };

    if (!formState.email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!formState.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (!valid) {
      setFormState({
        ...formState,
        errors: newErrors,
      });
      return;
    }
    if (rememberMe) {
      localStorage.setItem("email", formState.email);
      localStorage.setItem("password", formState.password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }

    onSubmit(formState.email, formState.password);
  };

  const handleGooleLogin = () => {
    window.location.href = `${API_URL}/auth/google-login`;
    console.log("google login");
  };
  return (
    <>
      <div style={{ background: "#d9fffc" }}>
        <form onSubmit={handleSubmit}>
          <div className="col-md-6 mx-auto" dir="rtl">
            <label>מייל</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div style={{ color: "red" }}>{formState.errors.email}</div>
          </div>
          <div className="col-md-6 mx-auto" dir="rtl">
            <label>סיסמה</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div style={{ color: "red" }}>{formState.errors.password}</div>
          </div>
          <div className="col-md-6 mx-auto">
            <button type="submit" className="btn btn-primary">
              התחבר
            </button>
          </div>
          <div className="col-md-6 mx-auto" dir="rtl">
            <p>
              עדיין אין לך משתמש?? <Link to="/register">הירשם</Link>
            </p>
          </div>
        </form>
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
            <button onClick={handleGooleLogin} className="btn btn-primary">התחברות עם google</button>
          </div>
      <label style={{ direction: "ltr" }}>
        זכור פרטי התחברות
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
      </label>
    </>
  );
};

export default Login;
