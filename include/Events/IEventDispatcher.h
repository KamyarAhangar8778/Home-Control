/**
 * @file IEventDispatcher.h
 * @brief Interface for event dispatching system
 * @author uniuno
 * 
 * PURPOSE: Decouple from concrete EventDispatcher implementation
 * BENEFIT: Testability, Extensibility, Dependency Inversion
 */

#pragma once

#include <cstdint>
#include <cstddef>

namespace uniuno {

/**
 * @class IEventDispatcher
 * @brief Abstract interface for event dispatching
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
   * @return uint32_t The unique subscription ID (can be used to remove the listener later)
   */
  virtual uint32_t registerListener(const char* event_name, 
                                    void (*callback)(void*), 
                                    bool is_once = false) = 0;

  /**
   * @brief Remove a specific listener by its subscription ID
   * @param event_name Event type name
   * @param listener_id The unique subscription ID returned by registerListener
   * @return bool True if removed successfully, false otherwise
   */
  virtual bool removeListenerById(const char* event_name, uint32_t listener_id) = 0;

  /**
   * @brief Remove all listeners for a specific event
   * @param event_name Event type name
   * @return size_t Number of listeners removed
   */
  virtual size_t removeListener(const char* event_name) = 0;
};

} // namespace uniuno
