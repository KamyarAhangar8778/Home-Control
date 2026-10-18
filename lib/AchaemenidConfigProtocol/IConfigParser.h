#pragma once

#include "ConfigTypes.h"

namespace uniuno {

class IConfigParser {
public:
    virtual ~IConfigParser() = default;

    /**
     * @brief Parse the configuration payload into the provided ParseResult object.
     * @param payload The raw configuration string.
     * @param outResult Reference to a pre-allocated ParseResult object.
     * @return true if parsing was successful and at least one segment was parsed.
     */
    virtual bool parse(const char* payload, ParseResult& outResult) = 0;
};

} // namespace uniuno
