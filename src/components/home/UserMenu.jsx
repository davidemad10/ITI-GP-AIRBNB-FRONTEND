import React from "react";
import { Menu } from "lucide-react";
import AvatarComponent from "./Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal, openSignupModal } from "../../redux/modalSlice";
import { performLogout } from "../../redux/authSlice";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const UserMenu = ({ airbnbYourHome }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  // console.log("USER from MENU ..................", user);

  const handleLogout = async () => {
    try {
      await dispatch(performLogout()).unwrap();

      toast.success("See you soon :)!", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error.message);
      toast.error("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn d-flex align-items-center gap-2 p-2 rounded-circle border-none"
        type="button"
        id="userMenuDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Menu />
        {isLoggedIn && <AvatarComponent avatarUrl={user?.avatar} />}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="userMenuDropdown"
      >
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/profile" className="dropdown-item">
                User Profile
              </Link>
            </li>
            <li>
              <Link to="/chat" className="dropdown-item">
                Inbox
              </Link>
            </li>
            <li>
              <Link to="/MyReservations" className="dropdown-item">
                My Reservations
              </Link>
            </li>
            <li>
              {user ? (
                <Link to={`/landlord/${user.id}`} className="dropdown-item">
                  My Properties
                </Link>
              ) : (
                <span>Loading...</span>
              )}
            </li>
            <li>
              <Link to="/my-favorites" className="dropdown-item">
                My Favorites
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={airbnbYourHome}>
                Host Your Property
              </button>
            </li>
            <li>
              <Link to="/terms" className="dropdown-item">
              Terms and Conditions
              </Link>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate("/contact-support")}
              >
                Contact Support
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button
                className="dropdown-item"
                onClick={() => dispatch(openLoginModal())}
              >
                Login
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => dispatch(openSignupModal())}
              >
                Sign up
              </button>
            </li>
            <li>
              <button className="dropdown-item">Help Center</button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate("/contact-support")}
              >
                Contact Support
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

UserMenu.propTypes = {
  airbnbYourHome: PropTypes.func.isRequired,
};

export default UserMenu;
