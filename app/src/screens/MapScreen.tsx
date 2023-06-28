import React from "react";
import MapTemplate from "../components/templates/MapTemplate";
import useLocation from "../hooks/sdk/useLocation";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

const MapScreen = () => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { getCurrentPosition } = useLocation(() => {
    showAlert(
      toast,
      <Alert
        status="error"
        onPressCloseButton={() => toast.closeAll()}
        text={t("permitRequestGPS")}
      />
    );
  });

  return <MapTemplate get} />;
};

export default MapScreen;
