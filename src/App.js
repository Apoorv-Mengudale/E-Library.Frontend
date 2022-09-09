import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { AuthProvider } from "./Components/Auth";
import About from "./Pages/About";
import RequireAuth from "./Components/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "./Components/Loader";
import WithoutNav from "./Components/Navbar/WithoutNav";
import WithNav from "./Components/Navbar/WithNav";
import Books from "./Pages/Books";
import UserManager from "./Pages/UserManager";
function App() {
  return (
    <>
      <Loader>
        <AuthProvider>
          <Router>
            <Routes>
              <Route element={<WithoutNav />}>
                <Route path="/login" element={<Login />}></Route>
              </Route>
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <Navigate to="/" />
                  </RequireAuth>
                }
              />
              <Route element={<WithNav />}>
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <RequireAuth>
                      <About />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/ManageBooks"
                  element={
                    <RequireAuth>
                      <Books />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/ManageUsers"
                  element={
                    <RequireAuth>
                      <UserManager />
                    </RequireAuth>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </Loader>
      <ToastContainer />
    </>
  );
}

export default App;
