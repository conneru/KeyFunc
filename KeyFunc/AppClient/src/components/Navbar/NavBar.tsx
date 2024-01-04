import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faHouse,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { logOut } from "../../features/authSlice";
import { useEffect, useState } from "react";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

interface NavbarProps {
  defaultSize: boolean;
}

function NavBar({ defaultSize = true }: NavbarProps) {
  const [size, setSize] = useState<boolean>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    handleNavbarSize();
    window.addEventListener("resize", handleNavbarSize);
  }, []);

  return (
    <div className="sidebar-wrapper" style={size ? undefined : sidebarWrapper}>
      <div className="sidebar">
        <div className="sidebar-item-wrapper">
          <div className="sidebar-item" onClick={() => navigate("/")}>
            <FontAwesomeIcon className="icon" icon={faHouse} />
            <div className="item-label">
              <span style={size ? undefined : sidebarSpan}>Home</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div className="sidebar-item">
            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
            <div className="item-label">
              <span style={size ? undefined : sidebarSpan}>Search</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div className="sidebar-item" onClick={() => navigate("/chat")}>
            <FontAwesomeIcon className="icon" icon={faPaperPlane} />
            <div className="item-label">
              <span style={size ? undefined : sidebarSpan}>Messages</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div className="sidebar-item">
            <FontAwesomeIcon className="icon" icon={faPlus} />
            <div className="item-label">
              <span style={size ? undefined : sidebarSpan}>Create</span>
            </div>
          </div>
        </div>
        <div className="sidebar-item-wrapper">
          <div className="sidebar-item">
            <img
              alt="ProfilePicture"
              src="https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x2.jpg?w=1638&h=1092"
              className="icon"
            />
            <div className="item-label">
              <span style={size ? undefined : sidebarSpan}>Profile</span>
            </div>
          </div>
        </div>

        <div
          className="whitespace "
          style={{ flexGrow: 1, width: "100%" }}
        ></div>

        <div className="sidebar-item-wrapper">
          <div
            className="sidebar-item dropdown "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FontAwesomeIcon className="icon" icon={faBars} />
            <div className="item-label">
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
    </div>
  );
}

export default NavBar;
