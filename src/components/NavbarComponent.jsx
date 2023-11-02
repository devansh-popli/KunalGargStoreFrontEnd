import { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import s from "./Navbar.module.scss";
import clsx from "clsx";
import { doLogoutFromLocalStorage } from "../auth/HelperAuth";
function NavbarComponent({ setToggle }) {
  const userContext = useContext(UserContext);
  useEffect(() => {
    if (userContext.isLogin) {
      setToggle(true);
    }
    else{
      setToggle(false);
    }
  }, [userContext.isLogin]);
  return userContext.isLogin && (
    <div className={s.navWrapper}>
      <div className={s.navbar}>
        <ul className={s.navbarWrapper}>
          
          <img
            width={20}
            height={20}
            src={"../../menu.svg"}
            alt="Menu Icon"
            className={s.menuIcon}
            onClick={() => setToggle((prev) => !prev)}
          />
       
          <li className={clsx(s.marginLeftAuto, "nav-item")}>
            <div className={clsx(s.dropdown, s.profileButton, "nav-link")}>
              <img
                src={"../../user.jpg"}
                alt="profile image"
                className={clsx(s.img, "mx-1")}
                // onClick={profilePage}
              />
            </div>
            <div className={clsx(s.dropdown, "nav-link")}>
              <img
                height={16}
                width={4}
                src={"../../combinedShape.png"}
                alt="dropdown icon"
                className="me-2 me-4"
              />

              <div className={s.dropdownContent}>
                <div className={s.profileCard}>
                  <div className={s.profile}>
                    <div className={s.profileInfo}>
                      <img
                        referrerPolicy="no-referrer"
                        className={s.profileImage}
                        src={"../../user.jpg"}
                        width={40}
                        height={40}
                        alt="profile-img"
                      />
                      <div className="pl-2">
                        <p className={s.name}>
                          <b>{userContext?.userData?.name}</b>
                        </p>
                        {/* <p className={s.designation}>{details.designation}</p> */}
                      </div>
                    </div>
                    {/* <div
                      className={clsx("btn", s.viewProfileBtn)}
                      onClick={profileRouting}
                    >
                      View Profile
                    </div> */}
                  </div>
                  <hr className={s.hr} />
                  <ul className={clsx(s.dropdown)}>
                    <li>
                      <button
                        className={s.logout}
                        onClick={() => userContext.doLogout()}
                      >
                        <img
                          src={"../../logout.png"}
                          alt="logout"
                          width={15}
                          height={15}
                          className="text-danger"
                        />{" "}
                        <span className="ml-1">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  );
}

export default NavbarComponent;
