#ifndef NVS_SEGMENT_STORAGE_H
#define NVS_SEGMENT_STORAGE_H

#include "ISegmentStorage.h"
#include <Preferences.h>

namespace uniuno {

class NvsSegmentStorage : public ISegmentStorage {
public:
    NvsSegmentStorage() = default;
    ~NvsSegmentStorage() override = default;

    void saveSegmentConfig(const ParseResult& parsed) override;
    bool loadSegmentConfig(ParseResult& out) override;
};

} // namespace uniuno

#endif // NVS_SEGMENT_STORAGE_H
