/**
 * @file IEventDispatcher.h
 * @brief Interface for event dispatching system
 * @author uniuno
 * 
 * PURPOSE: Decouple Timer from concrete EventDispatcher implementation
 * BENEFIT: Testability, Extensibility, Dependency Inversion
 * 
 * WHY THIS EXISTS:
 *   - Allows custom EventDispatcher implementations
 *   - Enables mock dispatchers for testing
 *   - Follows SOLID principles (Dependency Inversion)
 */

#pragma once

namespace uniuno {

/**
 * @class IEventDispatcher
 * @brief Abstract interface for event dispatching
 * 
 * RESPONSIBILITY: Define contract for event dispatching
 * PATTERN: Interface Segregation Principle
 */
class IEventDispatcher {
public:
  virtual ~IEventDispatcher() = default;

  /**
   * @brief Dispatch event to registered listeners
   * @param event Pointer to event data
   * @param event_name Name of the event type
   */
  virtual void dispatch(void* event, const char* event_name) = 0;

  /**
   * @brief Register event listener
   * @param event_name Event type name
   * @param callback Callback function
   * @param is_once Execute once and remove
   */
  virtual void registerListener(const char* event_name, 
                                 void (*callback)(void*), 
                                 bool is_once = false) = 0;
};

} // namespace uniuno
