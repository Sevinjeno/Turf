import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../store";
import { Navigate } from "react-router-dom";



const ProtectedRoute=({children}:{children:JSX.Element})=>{

    const { accessToken } = useAppSelector((state) => state.auth);

      if (!accessToken) {
    // Not logged in → redirect
    return <Navigate to="/" replace />;
  }

  // Logged in → render page
  return children;
};




export default ProtectedRoute

{/* <Route
  path="/user"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/> */}