import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { APP_NAME, ROUTES } from "../../constants";
import "./Dashboard.scss";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <span className="brand">{APP_NAME}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>

          <div className="user-info">
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <span className="info-value">
                {user?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since</span>
              <span className="info-value">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
