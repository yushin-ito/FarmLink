#include "M5_ENV.h"
#include <WiFi.h>
#include <esp_now.h>

SHT3X sht30;
QMP6988 qmp6988;

float tmp = 0.0;
float hum = 0.0;
float pressure = 0.0;

uint8_t broadcastAddress[] = {0x78, 0x21, 0x84, 0x8A, 0x42, 0xCC};

uint16_t analogRead_value = 0;
uint16_t digitalRead_value = 0;

typedef struct struct_message {
    uint8_t id;
    uint8_t num;
} struct_message;

struct_message data;

esp_now_peer_info_t peerInfo;

void on_data_sent(const uint8_t *mac_addr, esp_now_send_status_t status) {
    Serial.print("Recv: ");
    Serial.println(status == ESP_NOW_SEND_SUCCESS ? "success" : "failed");
}

void setup() {
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);

    Wire.begin();
    qmp6988.init();

    if (esp_now_init() != ESP_OK) {
        Serial.println("Error init ESP-NOW");
        return;
    }

    esp_now_register_send_cb(on_data_sent);

    memcpy(peerInfo.peer_addr, broadcastAddress, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;

    if (esp_now_add_peer(&peerInfo) != ESP_OK) {
        Serial.println("Failed to add peer");
        return;
    }
}

void loop() {
    data.id = 1;
    data.num = random(0, 100);

    pressure = qmp6988.calcPressure();

    if (sht30.get() == 0) {
        tmp = sht30.cTemp;
        hum = sht30.humidity;
    } else {
        tmp = 0;
        hum = 0;
    }

    Serial.printf("Temp:%2.1f  Humi:%2.0f%%  Pressure:%2.0fPa\r\n", tmp, hum,
                  pressure);

    // analogRead_value = analogRead(32);
    // delay(100);
    // printf("Earth: %d\n", analogRead_value);

    esp_err_t result =
        esp_now_send(broadcastAddress, (uint8_t *)&data, sizeof(data));

    if (result == ESP_OK) {
        Serial.println("Send: success");
    } else {
        Serial.println("Send: failed");
    }

    delay(1 * 1000);
}