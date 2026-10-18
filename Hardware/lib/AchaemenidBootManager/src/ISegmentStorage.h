#pragma once

#include <ConfigTypes.h>

namespace uniuno {

class ISegmentStorage {
public:
    virtual ~ISegmentStorage() = default;

    /**
     * @brief Save segment configuration.
     * @param parsed The parsed configuration result.
     */
    virtual void saveSegmentConfig(const ParseResult& parsed) = 0;

    /**
     * @brief Load segment configuration.
     * @param out The output configuration result.
     * @return true if successful and data was loaded.
     */
    virtual bool loadSegmentConfig(ParseResult& out) = 0;
};

} // namespace uniuno
