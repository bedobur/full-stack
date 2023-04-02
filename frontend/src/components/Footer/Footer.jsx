import { Link } from "react-router-dom";
//import SourceCodeLink from "../SourceCodeLink";

function Footer() {
  return (
    <div className="container">
      <Link to="/" className="logo-font">
        Disaster Aid
      </Link>
      <span className="attribution">
        Help Coordination 
      </span>
    </div>
  );
}

export default Footer;
