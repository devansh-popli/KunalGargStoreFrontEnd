import { Badge } from "@mui/material";
import cns from "classnames";
import clsx from "clsx";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import s from "./Navbar.module.scss";
import Sidebar from "./Sidebar";
const NavbarComponent = React.memo(({ toggle,setToggle }) => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    if (userContext.isLogin) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [userContext.isLogin]);
  return userContext.isLogin && (
    <div className={s.navWrapper}>
       <Sidebar toggle={toggle} setToggle={setToggle} />
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
            {userContext?.userData?.roles[0].roleName === "ROLE_ADMIN" && (
              <Link
                to={"/admin-dashboard"}
                as={Link}
                style={{ textDecoration: "none" }}
                className={cns(s.adminD, "text-secondary fw-bold")}
              >
                Admin Dashboard
              </Link>
            )}
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

                      <div className="pl-2 d-flex flex-column justify-content-center">
                        <p className={cns(s.name)}>
                          <b>{userContext?.userData?.name}</b>
                        </p>
                        {/* <p className={s.designation}>{details.designation}</p> */}
                        <div>
                          <Badge
                            className={cns(s.name, "ms-4 text-center")}
                            color={
                              userContext?.userData?.roles[0].roleName ===
                              "ROLE_ADMIN"
                                ? "success"
                                : "secondary"
                            }
                            badgeContent={
                              <small>
                                {userContext?.userData?.roles[0].roleName ===
                                "ROLE_ADMIN"
                                  ? "Admin"
                                  : userContext?.userData?.roles[0].roleName.slice(
                                      5
                                    )}
                              </small>
                            }
                          ></Badge>
                        </div>
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
});

export default React.memo(NavbarComponent);
