import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavItem from "../NavItem";
import DropdownMenu from "./DropdownMenu";

function Navbar() {
  const { isAuth } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Disaster Aid
        </Link>

        <ul className="nav navbar-nav pull-xs-right">
          <NavItem text="Home" icon="ion-home" url="/" />

          {isAuth && (
            <>
              <NavItem text="New Aid" icon="ion-compose" url="/editor" />
              <DropdownMenu />
            </>
          )}

          {!isAuth && (
            <>
              <NavItem text="Login" icon="ion-log-in" url="/login" />
              <NavItem text="Sign up" icon="ion-person-add" url="/register" />
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
