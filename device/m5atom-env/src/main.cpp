#include <M5Atom.h>
#include "M5_ENV.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

#include "env.h"

#define SLEEP_TIME 1 * 60 // 10分

const char* table = "device";

SHT3X sht30;

float tmp = 0.0;
float hum = 0.0;

void setup() {
    Serial.begin(115200);

    // WiFi接続
    WiFi.begin(SSID, PASSWORD);
    Serial.print("WiFi connecting...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    // 初期化
    Wire.begin(26, 32);
    WiFiClientSecure client;
    client.setInsecure();
    
    // センサーデータを取得
    if (sht30.get() == 0) {
        tmp = sht30.cTemp;
        hum = sht30.humidity;
    }
    else {
        tmp = 0;
        hum = 0;
    }
    delay(100);

    Serial.printf("Tmp:%2.1fC Hum:%2.1f%%", tmp, hum);

    HTTPClient http;
    int http_code;

    // センサーデータをデータベースに送信
    if (http.begin(client, String(SUPABASE_URL) + "/rest/v1/" + String(table))) {
        http.addHeader("Content-Type", "application/json");
        http.addHeader("apikey", String(SUPABASE_KEY));
        http.addHeader("Authorization", "Bearer " + String(SUPABASE_KEY));
        http.addHeader("Prefer", "resolution=merge-duplicates"); // UPSERT
        String payload = "{\"deviceId\":\"" + String(UUID) + "\",\"temperture\":\"" + String(tmp) + "\",\"humidity\":\"" + String(hum) + "\"}";
        http_code = http.sendRequest("POST", payload);
        if (http_code > 0) {
            String response = http.getString();
            Serial.print("code: ");
            Serial.println(http_code);
            Serial.print("response: ");
            Serial.println(response);
        }
        else {
            Serial.print("error: ");
            Serial.println(http_code);
        }
        http.end();
    }

    WiFi.disconnect(true);
    esp_sleep_enable_timer_wakeup(SLEEP_TIME * 1000000UL);
    esp_deep_sleep_start();
}

void loop() {
}