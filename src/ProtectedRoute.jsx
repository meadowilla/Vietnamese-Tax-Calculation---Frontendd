import { selectIsAuthLoading, selectUser } from "./redux/UserSlice";
import Spinner from "./screens/Spinner";
import {Navigate} from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
    const user = useSelector(selectUser);
    const isAuthLoading = useSelector(selectIsAuthLoading);

    // nếu đang tải thông tin người dùng
    if (isAuthLoading) {
        return <Spinner />;
    }

    // user chưa đăng nhập 
    if (!user) {
        return <Navigate to ="/account/signin" replace />;
    }

    return children;
}

export default ProtectedRoute;