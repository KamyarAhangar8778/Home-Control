/**
 * @file TimerConfig.h
 * @brief User configuration for Timer library features
 * @author uniuno
 * 
 * @details
 * Configure which Timer features to compile into your project.
 * Disabling unused features reduces Flash and RAM usage.
 * 
 * USAGE:
 *   - Uncomment (#define) features you need
 *   - Comment out (// #define) unused features
 * 
 * MEMORY OPTIMIZATION:
 *   - Each disabled feature saves ~50-200 bytes of Flash
 *   - Reduces RAM usage by removing unused vectors
 *   - Dependencies are auto-enabled (e.g., IMMEDIATE needs TIMEOUT)
 * 
 * EVENT PRESETS:
 *   Use presets for common event configurations:
 *   - TIMER_ENABLE_ALL_EVENTS: All events enabled
 *   - TIMER_ENABLE_DEBUG_EVENTS: Only debug-related events
 *   - TIMER_ENABLE_MONITORING_EVENTS: Only monitoring events
 * 
 * EXAMPLE - Minimal configuration (setTimeout only):
 * @code
 *   #define TIMER_ENABLE_TIMEOUT      // ✓ Enabled
 *   // #define TIMER_ENABLE_INTERVAL  // ✗ Disabled
 *   // #define TIMER_ENABLE_IMMEDIATE // ✗ Disabled
 *   // #define TIMER_ENABLE_INTERVAL_UNTIL // ✗ Disabled
 *   // #define TIMER_ENABLE_ON_LOOP   // ✗ Disabled
 *   // #define TIMER_ENABLE_CLEAR     // ✗ Disabled
 * @endcode
 * 
 * @see Timer.h for API documentation
 */

#pragma once

// ============================================
// EVENT PRESETS (Optional - use for convenience)
// ============================================

/**
 * @def TIMER_ENABLE_ALL_EVENTS
 * @brief Enable all timer events
 * 
 * Enables: CREATED, EXPIRED, CANCELLED, RESCHEDULED, TICK
 * USE CASE: Full debugging and monitoring
 */
// #define TIMER_ENABLE_ALL_EVENTS

/**
 * @def TIMER_ENABLE_DEBUG_EVENTS
 * @brief Enable debug-related events only
 * 
 * Enables: CREATED, EXPIRED, CANCELLED
 * USE CASE: Development and debugging
 */
// #define TIMER_ENABLE_DEBUG_EVENTS

/**
 * @def TIMER_ENABLE_MONITORING_EVENTS
 * @brief Enable monitoring events only
 * 
 * Enables: EXPIRED, RESCHEDULED
 * USE CASE: Production monitoring
 */
// #define TIMER_ENABLE_MONITORING_EVENTS

#define TIMER_EVENT_EXPIRED
#define TIMER_EVENTS_ENABLED

// Apply presets
#ifdef TIMER_ENABLE_ALL_EVENTS
  #define TIMER_EVENT_CREATED
  #define TIMER_EVENT_EXPIRED
  #define TIMER_EVENT_CANCELLED
  #define TIMER_EVENT_RESCHEDULED
  #define TIMER_EVENT_TICK
  #define TIMER_EVENTS_ENABLED
#define TIMER_ENABLE_ALL_EVENTS
#endif

#ifdef TIMER_ENABLE_DEBUG_EVENTS
  #define TIMER_EVENT_CREATED
  #define TIMER_EVENT_EXPIRED
  #define TIMER_EVENT_CANCELLED
  #define TIMER_EVENTS_ENABLED
#endif

#ifdef TIMER_ENABLE_MONITORING_EVENTS
  #define TIMER_EVENT_EXPIRED
  #define TIMER_EVENT_RESCHEDULED
  #define TIMER_EVENTS_ENABLED
#endif

// ============================================
// FEATURE FLAGS - Enable/Disable as needed
// ============================================

/**
 * @def TIMER_ENABLE_TIMEOUT
 * @brief Enable setTimeout() functionality
 * 
 * PURPOSE: Execute callback once after specified delay
 * MEMORY: ~100 bytes Flash + vector overhead
 * USE CASE: One-time delayed actions (e.g., debouncing, delayed start)
 * 
 * @see Timer::set_timeout()
 */
#define TIMER_ENABLE_TIMEOUT

/**
 * @def TIMER_ENABLE_INTERVAL
 * @brief Enable setInterval() functionality
 * 
 * PURPOSE: Execute callback repeatedly at fixed intervals
 * MEMORY: ~150 bytes Flash + vector overhead
 * USE CASE: Periodic tasks (sensor reading, data sending, LED blinking)
 * 
 * @see Timer::set_interval()
 */
#define TIMER_ENABLE_INTERVAL

/**
 * @def TIMER_ENABLE_IMMEDIATE
 * @brief Enable setImmediate() functionality
 * 
 * PURPOSE: Execute callback on next tick (0ms delay)
 * MEMORY: ~50 bytes Flash (uses setTimeout internally)
 * USE CASE: Break long operations into non-blocking chunks
 * DEPENDENCY: Auto-enables TIMER_ENABLE_TIMEOUT
 * 
 * @see Timer::set_immediate()
 */
#define TIMER_ENABLE_IMMEDIATE

/**
 * @def TIMER_ENABLE_INTERVAL_UNTIL
 * @brief Enable set_interval_until() functionality
 * 
 * PURPOSE: Execute interval until condition met or timeout reached
 * MEMORY: ~200 bytes Flash
 * USE CASE: Polling with condition/timeout (e.g., wait for sensor ready)
 * DEPENDENCY: Auto-enables TIMER_ENABLE_INTERVAL
 * 
 * @see Timer::set_interval_until()
 */
#define TIMER_ENABLE_INTERVAL_UNTIL

/**
 * @def TIMER_ENABLE_ON_LOOP
 * @brief Enable set_on_loop() functionality
 * 
 * PURPOSE: Execute callback every tick (0ms interval)
 * MEMORY: ~80 bytes Flash
 * USE CASE: High-frequency monitoring, real-time processing
 * DEPENDENCY: Auto-enables TIMER_ENABLE_INTERVAL
 * 
 * @warning High CPU usage - use sparingly
 * @see Timer::set_on_loop()
 */
// #define TIMER_ENABLE_ON_LOOP

/**
 * @def TIMER_ENABLE_CLEAR
 * @brief Enable clear_timeout() and clear_interval() functionality
 * 
 * PURPOSE: Cancel scheduled timers before execution
 * MEMORY: ~100 bytes Flash
 * USE CASE: Dynamic timer management, conditional cancellation
 * 
 * @see Timer::clear_timeout()
 * @see Timer::clear_interval()
 */
#define TIMER_ENABLE_CLEAR

/**
 * @def TIMER_ENABLE_GROUPS
 * @brief Enable timer groups for batch management
 * 
 * PURPOSE: Manage multiple timers as a group
 * MEMORY: ~300 bytes Flash + 24 bytes per group
 * USE CASE: Pause/resume/clear multiple timers together
 * 
 * USAGE:
 * @code
 *   #include <Timer/TimerGroup.h>
 *   TimerGroup group;
 *   group.add(timer.setTimeout(...));
 *   group.pauseAll();
 *   group.resumeAll();
 * @endcode
 */
#define TIMER_ENABLE_GROUPS

// ============================================
// ASYNC/FUTURE SUPPORT (Optional)
// ============================================



// ============================================
// OPTIMIZATION FLAGS
// ============================================

/**
 * @def TIMER_ENABLE_OPTIMIZATIONS
 * @brief Enable SmallVector + FastFunction optimizations
 * 
 * PURPOSE: Reduce memory usage and increase speed
 * MEMORY SAVINGS: ~38% less memory for typical usage
 * SPEED IMPROVEMENT: 2-3x faster callback execution
 * 
 * CHANGES:
 *   - std::vector → SmallVector (stack storage for ≤4 timers)
 *   - std::function → FastFunction (no virtual call overhead)
 * 
 * TRADE-OFFS:
 *   + 38% less memory (10 timers: 984→608 bytes)
 *   + 2-3x faster callbacks
 *   - FastFunction limited to 32-byte captures
 * 
 * @see Optimization/SmallVector.h
 * @see Optimization/FastFunction.h
 */
#define TIMER_ENABLE_OPTIMIZATIONS

/**
 * @def TIMER_SORT_STRATEGY
 * @brief Choose sorting algorithm for timeout queue
 * 
 * OPTIONS:
 *   - FULL_SORT: Simple std::sort (best for <5 timers)
 *   - BINARY_INSERT: Binary search + insert (best for 5-20 timers)
 * 
 * TRADE-OFFS:
 *   FULL_SORT: Simple, O(n log n)
 *   BINARY_INSERT: 2-3x faster, O(n)
 * 
 * @see Optimization/SortStrategy.h
 */
#define TIMER_SORT_STRATEGY_BINARY_INSERT

/**
 * @def TIMER_CACHE_TIME
 * @brief Cache millis() in tick() to reduce pointer dereference
 * 
 * BENEFIT: 5-10% faster tick()
 * MEMORY: 0 bytes (stack only)
 */
#define TIMER_CACHE_TIME


// ============================================
// VALIDATION & DEPENDENCY RESOLUTION
// ============================================

/**
 * @brief Ensure at least one feature is enabled
 * 
 * Compilation will fail if no features are enabled to prevent
 * creating an empty library.
 */
#if !defined(TIMER_ENABLE_TIMEOUT) && \
    !defined(TIMER_ENABLE_INTERVAL) && \
    !defined(TIMER_ENABLE_IMMEDIATE) && \
    !defined(TIMER_ENABLE_INTERVAL_UNTIL)
#error "Timer: At least one feature must be enabled in TimerConfig.h"
#endif

// Auto-enable dependencies
#ifdef TIMER_ENABLE_IMMEDIATE
  #ifndef TIMER_ENABLE_TIMEOUT
    #define TIMER_ENABLE_TIMEOUT  // Immediate depends on timeout
  #endif
#endif



#ifdef TIMER_ENABLE_INTERVAL_UNTIL
  #ifndef TIMER_ENABLE_INTERVAL
    #define TIMER_ENABLE_INTERVAL  // interval_until depends on interval
  #endif
#endif
