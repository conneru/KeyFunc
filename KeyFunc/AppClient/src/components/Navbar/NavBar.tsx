import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faHouse,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logOut } from "../../features/authSlice";
import { useEffect, useState } from "react";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { Chat } from "../../types";
import CreatePostModal from "../CreatePostModal/CreatePostModal";

interface NavbarProps {
  defaultSize: boolean;
}

function NavBar({ defaultSize }: NavbarProps) {
  const user = useAppSelector((state) => state.auth.User);
  const chats = useAppSelector((state) => state.chat.Chats);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [size, setSize] = useState<boolean>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let checkedChats = new Set<number>();

  const handleNavbarSize = () => {
    if (window.innerWidth < 765) {
      setSize(true);
    } else {
      setSize(defaultSize);
    }
  };
  window.addEventListener("resize", handleNavbarSize);
  const sidebarWrapper: React.CSSProperties = {
    width: "71px",
  };

  const sidebarSpan: React.CSSProperties = {
    display: "none",
  };

  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    handleNavbarSize();
    window.addEventListener("resize", handleNavbarSize);
  }, [defaultSize]);

  useEffect(() => {
    if (chats) {
      chats.forEach((c: Chat) => {
        if (
          user?.id &&
          c.id &&
          c.messages?.[0] &&
          !c.messages?.[0].usersWhoHaveRead.includes(user.id)
        ) {
          checkedChats.add(c.id);
        }
      });

      setUnread(checkedChats.size);
    }
  }, [chats]);

  return (
    <div className="sidebar-wrapper" style={size ? undefined : sidebarWrapper}>
      <div className="sidebar">
        <div className="sidebar-item-wrapper">
          <div
            className="sidebar-item"
            style={!defaultSize ? { justifyContent: "center" } : {}}
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon className="icon" icon={faHouse} />
            <div className="item-label" style={size ? undefined : sidebarSpan}>
              <span style={size ? undefined : sidebarSpan}>Home</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div
            className="sidebar-item"
            style={!defaultSize ? { justifyContent: "center" } : {}}
          >
            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
            <div className="item-label" style={size ? undefined : sidebarSpan}>
              <span style={size ? undefined : sidebarSpan}>Search</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div className="sidebar-item" onClick={() => navigate("/inbox")}>
            {unread > 0 ? (
              <div className="sidebar-notification">{unread}</div>
            ) : null}

            <FontAwesomeIcon className="icon" icon={faPaperPlane} />

            <div className="item-label" style={size ? undefined : sidebarSpan}>
              <span style={size ? undefined : sidebarSpan}>Messages</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div
            className="sidebar-item"
            style={!defaultSize ? { justifyContent: "center" } : {}}
            onClick={handleShow}
          >
            <FontAwesomeIcon className="icon" icon={faPlus} />
            <div className="item-label" style={size ? undefined : sidebarSpan}>
              <span style={size ? undefined : sidebarSpan}>Create</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div
            className="sidebar-item"
            style={!defaultSize ? { justifyContent: "center" } : {}}
            onClick={() => navigate(`/${user?.username}`)}
          >
            <img
              alt="ProfilePicture"
              src={
                user?.profilePic ||
                "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x2.jpg?w=1638&h=1092"
              }
              className="icon"
            />
            <div className="item-label" style={size ? undefined : sidebarSpan}>
              <span style={size ? undefined : sidebarSpan}>Profile</span>
            </div>
          </div>
        </div>

        <div style={{ flexGrow: 1, width: "100%" }}></div>

        <div className="sidebar-item-wrapper">
          <div
            className="sidebar-item dropdown "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FontAwesomeIcon className="icon" icon={faBars} />
            <div className="item-label" style={size ? undefined : sidebarSpan}>
              <span style={size ? undefined : sidebarSpan}>More</span>
            </div>
          </div>
          <ul className="dropdown-menu">
            <li>
              <div className="dropdown-item" onClick={() => dispatch(logOut())}>
                Log Out
              </div>
            </li>
          </ul>
        </div>
      </div>
      <CreatePostModal show={show} handleClose={handleClose} />
    </div>
  );
}

export function NavbarLayout({ defaultSize }: NavbarProps) {
  return (
    <div style={{ display: "flex", width: "100dvw" }}>
      <NavBar defaultSize={defaultSize} />
      <div style={{ width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default NavBar;
