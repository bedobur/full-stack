import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import "./main.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Aid from "./routes/Aid/Aid";
import CommentsSection from "./routes/Aid/CommentsSection";
import AidEditor from "./routes/AidEditor";
import Home from "./routes/Home";
import HomeAids from "./routes/HomeAids";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import Profile from "./routes/Profile/Profile";
import ProfileAids from "./routes/Profile/ProfileAids";
import ProfileFavAids from "./routes/Profile/ProfileFavAids";
import Settings from "./routes/Settings";
import SignUp from "./routes/SignUp";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />}>
              <Route index element={<HomeAids />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="register" element={<SignUp />} />

            <Route path="settings" element={<Settings />} />

            <Route path="editor" element={<AidEditor />}>
              <Route path=":slug" element={<AidEditor />} />
            </Route>

            <Route path="aid/:slug" element={<Aid />}>
              <Route index element={<CommentsSection />} />
            </Route>

            <Route path="profile/:username" element={<Profile />}>
              <Route index element={<ProfileAids />} />
              <Route path="favorites" element={<ProfileFavAids />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
