import React from "react";
import { Routes, Route } from "react-router-dom";

/* Pages & Components */
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import OtpVerification from "./components/OtpVerification";
import Home from "./components/Home";
import CanteenList from "./pages/CanteenList";
import MonitorDashboard from "./pages/MonitorDashboard";
import ProfilePage from "./components/ProfilePage";
import CanteenMenu from "./components/CanteenMenu";
import Cart from "./components/cart";
import OrderStatus from "./components/OrderStatus";
import PaymentSettings from "./components/PaymentSettings";
import ExcelMenuManager from "./components/ExcelMenuManager";
import InvoicePage from "./pages/InvoicePage";
import OrderTracking from "./pages/OrderTracking";
import SupportChat from "./components/SupportChat";
import Feedback from "./pages/Feedback";
import SettingsPage from "./pages/SettingsPage";
import CouponsPage from "./pages/CouponsPage";
import PaymentPage from "./pages/PaymentPage";
import WalletPage from "./pages/WalletPage";
import RewardsPage from "./pages/RewardsPage";
import VendorLogin from "./components/VendorLogin";
import EditProfile from "./pages/EditProfile";
import NotificationPreferences from "./pages/NotificationPreferences";
import AccountSettings from "./pages/AccountSettings";
import Orders from "./components/Orders";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/home" element={<Home />} />
        <Route path="/canteens" element={<CanteenList />} />
        <Route path="/monitor" element={<MonitorDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/canteen/:id" element={<CanteenMenu />} />
        <Route path="/order/:id" element={<OrderStatus />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<PaymentSettings />} />
        <Route path="/excel-menu-manager" element={<ExcelMenuManager />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/supportchat" element={<SupportChat />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/payment-page" element={<PaymentPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/vendor" element={<VendorLogin />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/notification-settings" element={<NotificationPreferences />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </div>
  );
}

export default App;
