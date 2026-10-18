#ifndef CONFIG_APPLIER_H
#define CONFIG_APPLIER_H

#include <AchaemenidConfigProtocol.h>
#include <PinManager.h>

/**
 * @namespace ConfigApplier
 * @brief Applies parsed configuration results to the PinManager.
 * 
 * Separates the configuration logic from the hardware GPIO logic.
 */
namespace ConfigApplier {
    /**
     * @brief Applies a parsed JSON configuration to the given PinManager.
     * 
     * @param config The ParseResult containing the segments to configure.
     * @param pinManager Pointer to the PinManager to configure.
     * @return int The number of successfully applied GPIO segments.
     */
    int apply(const ParseResult& config, PinManager* pinManager);
}

#endif // CONFIG_APPLIER_H
