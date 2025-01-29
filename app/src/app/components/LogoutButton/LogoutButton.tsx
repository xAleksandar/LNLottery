import RedCrossMarker from "../../../assets/images/RedCrossMark.png";
import { ApiService } from "@/app/lib/api/api";
import { ClickableImage } from "../";

import styles from "./LogoutButton.module.scss";

const LogoutButton = () => {
  const apiService = new ApiService();

  const handleLogout = async () => {
    await apiService.logout();
    window.location.reload();
  };

  return (
    <ClickableImage
      className={styles.logoutButton}
      src={RedCrossMarker}
      alt="Logout"
      onClick={handleLogout}
    />
  );
};

export default LogoutButton;
