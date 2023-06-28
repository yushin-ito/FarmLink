#include "WiFi.h"

String get_mac_adress() {
    WiFi.mode(WIFI_MODE_STA);
    return WiFi.macAddress();
}
