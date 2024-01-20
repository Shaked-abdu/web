import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import PostList from "./PostList";
import RegisterForm from "./Register";
import { useNavigate } from "react-router-dom";
import TopNavbar from "./Navbar";
import { API_URL, ACCESS_TOKEN_EXPIRES_IN } from "../config";
import AddPost from "./AddPost";
import Profile from "./Profile";
import { IUser } from "./Profile";
import PostDetails from "./PostDetails";
import Extra from "./Extra";
import { RegistrationFormData } from "./Register";
import Google from "./Google";

const App = () => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isGoogle, setIsGoogle] = useState<boolean>(false);

  useEffect(() => {
    if (email) {
      fetchUser();
    }
  }, [email]);

  useEffect(() => {
    if (user?._id) {
      fetchUserPosts();
    }
  }, [user]);

  useEffect(() => {
    if (accessToken && isLoggedIn) {
      fetchPosts();
    }
  }, [accessToken]);

  useEffect(() => {
    const tokenRefreshTimer = setInterval(() => {
      refreshTokens();
    }, ACCESS_TOKEN_EXPIRES_IN);

    return () => clearInterval(tokenRefreshTimer);
  }, [refreshToken]);

  const refreshTokens = () => {
    const refreshEndpoint = `${API_URL}/auth/refresh`;
    console.log(`refreshing tokens old access token: ${accessToken}`);
    console.log(`refreshing tokens old refresh token: ${refreshToken}`);
    axios
      .get(refreshEndpoint, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUser = () => {
    const userEndpoint = `${API_URL}/users/email/${email}`;
    axios
      .get(userEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserPosts = () => {
    const userPostsEndpoint = `${API_URL}/posts/user/${user?._id}`;
    axios
      .get(userPostsEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUserPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchPosts = () => {
    const postsEndpoint = `${API_URL}/posts`;
    axios
      .get(postsEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogin = (email: string, password: string) => {
    const loginEndpoint = `${API_URL}/auth/login`;

    axios
      .post(loginEndpoint, { email, password })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        setIsLoggedIn(true);
        setEmail(email);
        navigate("/posts");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsGoogle(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleRegistration = (formData: RegistrationFormData, image: File) => {
    const registerEndpoint = `${API_URL}/auth/register`;

    axios
      .post(registerEndpoint, formData)
      .then((res) => {
        const formData = new FormData();
        formData.append("image", image as Blob);

        axios
          .post(`${API_URL}/images/uploads/${res.data}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGoogleRegistration = (email: string, password: string) => {
    handleLogin(email, password);
    setIsGoogle(true);
    navigate("/posts");
  };

  return (
    <>
      <TopNavbar
        onLogout={handleLogout}
        onProfile={handleProfile}
        isLoggedIn={isLoggedIn}
        isGoolge={isGoogle}
      />
      <Routes>
        <Route
          path="/posts"
          element={
            <PostList
              posts={posts}
              userPosts={userPosts}
              accessToken={accessToken as string}
              logedInUserId={user?._id as string}
            />
          }
        />
        <Route path="/" element={<Login onSubmit={handleLogin} />} />
        <Route
          path="/register"
          element={<RegisterForm onSubmit={handleRegistration} />}
        />
        <Route
          path="/register-google/:email/:password"
          element={<Google onSubmit={handleGoogleRegistration} />}
        />
        <Route
          path="/add-post"
          element={
            <AddPost
              accessToken={accessToken as string}
              reloadPosts={fetchPosts}
              reloadUserPosts={fetchUserPosts}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              accessToken={accessToken as string}
              reloadUser={fetchUser}
            />
          }
        />
        <Route
          path="/post/:id"
          element={<PostDetails accessToken={accessToken as string} />}
        />
        <Route path="Extra" element={<Extra />} />
      </Routes>
    </>
  );
};

export default App;
