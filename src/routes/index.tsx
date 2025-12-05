import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../app/auth/login";
import Dashboard from "../app/dashboard";
import NotFound from "../app/OtherPage/NotFound";
import Blank from "../app/OtherPage/Blank";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";
import UserPage from "../app/users";
import MessageCenterPage from "../app/message-center";
import ProtectedRoute from '../app/guards/ProtectedRoute';
import SingleMessage from "../app/message-center/SingleMessage";
import TransactionPage from "../app/transaction";
import SingleTransactionPage from "../app/transaction/SingleTransaction";
import FxEnginePage from "../app/fx-engine";
import AddFxEnginePage from "../app/fx-engine/AddFxEngine";
import UpdateFxEnginePage from "../app/fx-engine/UpdateFxEngine";


const AppRoutes = () => {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route element={<AppLayout />}>

                    <Route index path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route index path="/users" element={<ProtectedRoute element={<UserPage />} />} />
                    <Route index path="/message-center" element={<ProtectedRoute element={<MessageCenterPage />} />} />
                    <Route index path="/message-center/:id" element={<ProtectedRoute element={<SingleMessage />} />} />
                    <Route index path="/transactions" element={<ProtectedRoute element={<TransactionPage />} />} />
                    <Route index path="/transactions/:id" element={<ProtectedRoute element={<SingleTransactionPage />} />} />
                    <Route index path="/fx-engine" element={<ProtectedRoute element={<FxEnginePage />} />} />
                    <Route index path="/fx-engine/add" element={<ProtectedRoute element={<AddFxEnginePage />} />} />
                    <Route index path="/fx-engine/update/:id" element={<ProtectedRoute element={<UpdateFxEnginePage />} />} />
                    <Route path="/blank" element={<Blank />} />
                </Route>

                {/* Auth Layout */}
                <Route path="/auth/login" element={<SignIn />} />
                <Route path="/" element={<SignIn />} />


                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
