/**
 * @file TimerFeatures.h
 * @brief Minimal feature configuration for Timer library
 * @author uniuno
 * 
 * PURPOSE: Simple struct-based feature selection
 * BENEFIT: Clear, type-safe configuration without overhead
 * 
 * USAGE:
 * @code
 *   TimerFeatures features;
 *   features.timeout = true;
 *   features.interval = true;
 *   features.clear = true;
 *   Timer timer(features);
 * @endcode
 */

#pragma once

namespace uniuno {

/**
 * @struct TimerFeatures
 * @brief Feature flags for Timer configuration
 * 
 * DESIGN: Simple boolean flags (zero overhead)
 * DEFAULT: All features enabled
 */
struct TimerFeatures {
    bool timeout = true;           ///< Enable setTimeout()
    bool interval = true;          ///< Enable setInterval()
    bool immediate = false;        ///< Enable setImmediate()
    bool interval_until = false;   ///< Enable set_interval_until()
    bool clear = true;             ///< Enable clear_timeout/clear_interval
    bool groups = false;           ///< Enable timer groups
    bool events = false;           ///< Enable event system
    bool optimizations = true;     ///< Enable Assembly optimizations
};

} // namespace uniuno
