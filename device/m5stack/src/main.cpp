#include <M5Stack.h>
#include <WiFi.h>
#include <esp_now.h>

typedef struct struct_message {
    uint8_t id;
    uint8_t num;
} struct_message;

struct_message data;

struct_message board1;
struct_message board2;

struct_message boards[2] = {board1, board2};

void on_data_recv(const uint8_t *mac_addr, const uint8_t *recv_data, int len) {
    char mac_str[18];
    Serial.print("From: ");
    snprintf(mac_str, sizeof(mac_str), "%02x:%02x:%02x:%02x:%02x:%02x",
             mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4],
             mac_addr[5]);
    Serial.println(mac_str);
    memcpy(&data, recv_data, sizeof(data));
    Serial.printf("ID: %u\n", data.id);
    Serial.printf("Size: %u bytes\n", data.id, len);
    boards[data.id - 1].num = data.num;
    Serial.printf("Value: %d \n", boards[data.id - 1].num);
    Serial.println();
}

void setup() {
    Serial.begin(115200);
    Serial2.begin(9600, SERIAL_8N1, 16, 17);

    WiFi.mode(WIFI_STA);

    if (esp_now_init() != ESP_OK) {
        Serial.println("Error init ESP-NOW");
        return;
    }

    esp_now_register_recv_cb(on_data_recv);
}

void loop() {
    if (Serial2.available()) {
        Serial.println(Serial2.readString());
    }
    // Serial2.println("AT$SF=CAFE");
    delay(60 * 1000);
}