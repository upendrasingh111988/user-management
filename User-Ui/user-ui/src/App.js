import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  /* ================= LOGIN STATE ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [loggedInUser, setLoggedInUser] = useState("");

  /* ================= USER CRUD STATE ================= */
  const [user, setUser] = useState({
    name: "",
    email: "",
    about: ""
  });

  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [singleUser, setSingleUser] = useState(null);

  const [updateUserId, setUpdateUserId] = useState("");
  const [updateUserData, setUpdateUserData] = useState({
    name: "",
    email: "",
    about: ""
  });

  /* ================= CHECK LOGIN ON LOAD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setIsLoggedIn(true);
      setLoggedInUser(username);
      fetchUsers(token);
    }
  }, []);

  /* ================= LOGIN FUNCTIONS ================= */
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const response = await fetch("http://localhost:8085/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      alert("Invalid credentials!");
      return;
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    setLoggedInUser(data.username);
    setIsLoggedIn(true);

    fetchUsers(data.token);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setLoggedInUser("");
  };

  /* ================= COMMON TOKEN HELPER ================= */
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    };
  };

  /* ================= CRUD FUNCTIONS ================= */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateChange = (e) => {
    setUpdateUserData({
      ...updateUserData,
      [e.target.name]: e.target.value
    });
  };

  const createUser = async () => {
    await fetch("http://localhost:8085/api/v1/createUser", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(user)
    });

    fetchUsers();
    alert("User Created Successfully!");
  };

  const fetchUsers = async (tokenParam) => {
    const response = await fetch("http://localhost:8085/api/v1/users", {
      method: "GET",
      headers: tokenParam
        ? {
            "Authorization": "Bearer " + tokenParam
          }
        : getAuthHeader()
    });

    const data = await response.json();
    setUsers(data);
  };

  const fetchUserById = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/v1/users/${searchId}`,
        {
          method: "GET",
          headers: getAuthHeader()
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setSingleUser(data);

    } catch {
      alert("User not found!");
      setSingleUser(null);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/v1/users/${updateUserId}`,
        {
          method: "PUT",
          headers: getAuthHeader(),
          body: JSON.stringify(updateUserData)
        }
      );

      if (!response.ok) throw new Error();

      alert("User Updated Successfully!");
      fetchUsers();

      setUpdateUserId("");
      setUpdateUserData({ name: "", email: "", about: "" });

    } catch {
      alert("Update failed!");
    }
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:8085/api/v1/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeader()
    });

    fetchUsers();
  };

  /* ================= LOGIN SCREEN ================= */
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleLoginChange}
        />
        <button className="btn primary" onClick={login}>
          Login
        </button>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <h1>User Management Dashboard</h1>
          <p>Welcome, <strong>{loggedInUser}</strong></p>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* CREATE USER */}
        <div className="card">
          <h2>Create User</h2>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input type="text" name="username" placeholder="username" onChange={handleChange} />
          <input type="password" name="password" placeholder="password" onChange={handleChange} />
          <input type="text" name="role" placeholder="role" onChange={handleChange} />
          <input type="text" name="about" placeholder="About" onChange={handleChange} />
          <button className="btn primary" onClick={createUser}>Create</button>
        </div>

        {/* SEARCH USER */}
        <div className="card">
          <h2>Search User</h2>
          <input
            type="number"
            placeholder="Enter User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="btn primary" onClick={fetchUserById}>Search</button>

          {singleUser && (
            <div className="user-card">
              <h3>{singleUser.name}</h3>
              <p><strong>Email:</strong> {singleUser.email}</p>
              <p><strong>About:</strong> {singleUser.about}</p>
            </div>
          )}
        </div>

        {/* UPDATE USER */}
        <div className="card">
          <h2>Update User</h2>
          <input
            type="number"
            placeholder="User ID"
            value={updateUserId}
            onChange={(e) => setUpdateUserId(e.target.value)}
          />
          <input
            type="text"
            name="name"
            placeholder="New Name"
            value={updateUserData.name}
            onChange={handleUpdateChange}
          />
          <input
            type="email"
            name="email"
            placeholder="New Email"
            value={updateUserData.email}
            onChange={handleUpdateChange}
          />
           <input
                      type="text"
                      name="username"
                      placeholder="New username"
                      value={updateUserData.username}
                      onChange={handleUpdateChange}
            />
             <input
                                  type="password"
                                  name="password"
                                  placeholder="New password"
                                  value={updateUserData.password}
                                  onChange={handleUpdateChange}
                        />

                        <input
                                                          type="text"
                                                          name="role"
                                                          placeholder="New role"
                                                          value={updateUserData.role}
                                                          onChange={handleUpdateChange}
                                                />
          <input
            type="text"
            name="about"
            placeholder="New About"
            value={updateUserData.about}
            onChange={handleUpdateChange}
          />
          <button className="btn warning" onClick={updateUser}>Update</button>
        </div>

        {/* USER LIST */}
        <div className="card">
          <h2>All Users</h2>
          {users.map((u) => (
            <div key={u.userId} className="user-card">
              <h3>{u.name}</h3>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>About:</strong> {u.about}</p>
              <button
                className="btn danger"
                onClick={() => deleteUser(u.userId)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 User Management System</p>
          <p>Built with React & Spring Boot</p>
        </div>
      </footer>

    </div>
  );
}

export default App;