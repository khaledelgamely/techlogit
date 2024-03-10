import Cookies from "js-cookie";
import { Navigate } from "react-router";
function UserGuard(props) {
  const token = Cookies.get("token");
  if (token) {
    return props.children;
  } else {
    return <Navigate to="/signin" />;
  }
}

export default UserGuard;
