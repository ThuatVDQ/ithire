import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Thêm Axios để gọi API
import {
  LuSearch,
  FiUser,
  FiSettings,
  FiLock,
  FiLogOut,
  FiLogIn,
} from "../assets/icons/vander";

export default function Navbar({ navClass, navLight }) {
  const [isOpen, setMenu] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [search, setSearch] = useState(false);
  const [cartitem, setCartitem] = useState(false);
  const [manu, setManu] = useState("");
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin người dùng
  const location = useLocation();
  const cartDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Gọi API lấy thông tin người dùng
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/auth/info",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data.user); // Lưu thông tin người dùng vào state
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };
    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const current = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1
    );
    setManu(current);
  }, [location.pathname]);

  useEffect(() => {
    function scrollHandler() {
      setScroll(window.scrollY > 50);
    }

    window.addEventListener("scroll", scrollHandler);

    const searchModal = () => setSearch(false);
    document.addEventListener("mousedown", searchModal);

    const cartModal = (event) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target)
      ) {
        setCartitem(false);
      }
    };
    document.addEventListener("mousedown", cartModal);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("mousedown", searchModal);
      document.removeEventListener("mousedown", cartModal);
    };
  }, []);

  const toggleMenu = () => {
    setMenu(!isOpen);
    if (document.getElementById("navigation")) {
      const anchorArray = Array.from(
        document.getElementById("navigation").getElementsByTagName("a")
      );
      anchorArray.forEach((element) => {
        element.addEventListener("click", (elem) => {
          const target = elem.target.getAttribute("href");
          if (target !== "") {
            if (elem.target.nextElementSibling) {
              var submenu = elem.target.nextElementSibling.nextElementSibling;
              submenu.classList.toggle("open");
            }
          }
        });
      });
    }
  };

  const renderUser = () => (
    <div className="dropdown dropdown-primary" ref={cartDropdownRef}>
      <button
        type="button"
        onClick={() => setCartitem(!cartitem)}
        className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary"
      >
        <img
          src={`http://localhost:8090${user?.avatar_url}`}
          className="img-fluid rounded-pill"
          alt=""
        />
      </button>
      <div style={{ display: cartitem === true ? "block" : "none" }}>
        <div
          className={`dropdown-menu dd-menu dropdown-menu-end bg-white rounded shadow border-0 mt-3 show`}
        >
          <Link to="/profile" className="dropdown-item fw-medium fs-6">
            <FiSettings className="fea icon-sm me-2 align-middle" />
            Settings
          </Link>
          <div className="dropdown-divider border-top"></div>
          <span
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              window.location.reload();
            }}
            className="dropdown-item fw-medium fs-6"
          >
            <FiLogOut className="fea icon-sm me-2 align-middle" />
            Logout
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <header id="topnav" className={`${scroll ? "nav-sticky" : ""} ${navClass}`}>
      <div className="container">
        <Link className="logo" to="/">
          <span className="text-primary">ITHIRE</span>
        </Link>
        <div className="menu-extras">
          <div className="menu-item">
            <Link
              to="#"
              className="navbar-toggle"
              id="isToggle"
              onClick={toggleMenu}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          </div>
        </div>
        <ul className="buy-button list-inline mb-0">
          <li className="list-inline-item ps-1 mb-0">
            {user ? (
              renderUser()
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </li>
        </ul>
        <div id="navigation">
          <ul
            className={`navigation-menu nav-right ${
              navLight ? "nav-light" : "nav-dark"
            }`}
          >
            <li className={manu === "home" ? "active" : ""}>
              <Link to="/home">Home</Link>
            </li>
            <li className={manu === "jobs" ? "active" : ""}>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li className={manu === "companies" ? "active" : ""}>
              <Link to="/companies">Companies</Link>
            </li>
            <li className={manu === "job-applied" ? "active" : ""}>
              <Link to="/job-applied">Job applied</Link>
            </li>
            <li className={manu === "favorite-jobs" ? "active" : ""}>
              <Link to="/favorite-jobs">Saved jobs</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
