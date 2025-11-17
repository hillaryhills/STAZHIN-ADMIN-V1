import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../app/auth/login";
import Dashboard from "../app/dashboard";
import NotFound from "../app/OtherPage/NotFound";
import Blank from "../app/OtherPage/Blank";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";
import UserPage from "../app/users";
import MessageCenterPage from "../app/message-center";

// import ProtectedRoute from '../app/guards/ProtectedRoute';



const AppRoutes = () => {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Dashboard Layout */}
                <Route element={<AppLayout />}>
                    {/* {<ProtectedRoute element={<Dashboard />} />} */}
                    <Route index path="/dashboard" element={<Dashboard />} />
                    <Route index path="/users" element={<UserPage />} />
                    <Route index path="/message-center" element={<MessageCenterPage />} />
                    <Route path="/blank" element={<Blank />} />
                </Route>

                {/* Auth Layout */}
                <Route path="/auth/login" element={<SignIn />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
