#include "NvsSegmentStorage.h"
#include <Arduino.h>

namespace uniuno {

void NvsSegmentStorage::saveSegmentConfig(const ParseResult& parsed) {
    Preferences segPrefs;
    bool started = segPrefs.begin("AchaemenidSeg", false);
    if (!started) {
        Serial.println("[SegStorage] Failed to open Segment Preferences");
        return;
    }

    int savedCount = 0;
    for (int i = 0; i < MAX_SEGMENTS; i++) {
        if (!parsed.segments[i].valid) continue;
        String prefix = "s" + String(savedCount);
        segPrefs.putString((prefix + "id").c_str(), parsed.segments[i].id);
        segPrefs.putString((prefix + "tp").c_str(), parsed.segments[i].type);
        segPrefs.putInt((prefix + "pn").c_str(), parsed.segments[i].pin);
        segPrefs.putInt((prefix + "ao").c_str(), parsed.segments[i].autoOffDelay);
        savedCount++;
        if (savedCount >= MAX_SEGMENTS) break;
    }
    segPrefs.putInt("count", savedCount);

    segPrefs.end();
    Serial.printf("[SegStorage] Saved %d segments to NVS\n", savedCount);
}

bool NvsSegmentStorage::loadSegmentConfig(ParseResult& out) {
    Preferences segPrefs;
    bool started = segPrefs.begin("AchaemenidSeg", true);
    if (!started) {
        Serial.println("[SegStorage] No segment config in NVS");
        return false;
    }

    int count = segPrefs.getInt("count", 0);
    if (count <= 0) {
        segPrefs.end();
        Serial.println("[SegStorage] NVS segment count is 0");
        return false;
    }

    out.count = 0;
    for (int i = 0; i < count && i < MAX_SEGMENTS; i++) {
        String prefix = "s" + String(i);
        String id   = segPrefs.getString((prefix + "id").c_str(), "");
        String type = segPrefs.getString((prefix + "tp").c_str(), "");
        int    pin  = segPrefs.getInt((prefix + "pn").c_str(), -1);
        int    ao   = segPrefs.getInt((prefix + "ao").c_str(), 0);

        if (id.length() > 0 && pin >= 0) {
            strncpy(out.segments[i].id,   id.c_str(),   sizeof(out.segments[i].id) - 1);
            out.segments[i].id[sizeof(out.segments[i].id) - 1] = '\0';
            strncpy(out.segments[i].type, type.c_str(), sizeof(out.segments[i].type) - 1);
            out.segments[i].type[sizeof(out.segments[i].type) - 1] = '\0';
            out.segments[i].pin          = pin;
            out.segments[i].autoOffDelay = ao;
            out.segments[i].value        = false;
            out.segments[i].valid        = true;
            out.count++;
        }
    }

    segPrefs.end();
    out.success = (out.count > 0);
    Serial.printf("[SegStorage] Loaded %d segments from NVS (offline fallback)\n", out.count);
    return out.success;
}

} // namespace uniuno
