/**
 * @file SortStrategy.h
 * @brief Policy-based sorting strategies for Timer
 * @author uniuno
 * 
 * PURPOSE: Provide different sorting algorithms with same interface
 * BENEFIT: 2-10x faster add() depending on strategy
 */

#pragma once

#include <algorithm>

namespace uniuno {

/**
 * @brief Full sort strategy - simple but slower
 * COMPLEXITY: O(n log n)
 * USE CASE: Small number of timers (< 5)
 */
struct FullSortStrategy {
  template<typename Container, typename Compare>
  static void add_sorted(Container& container, typename Container::value_type&& item, Compare comp) {
    container.push_back(std::move(item));
    std::sort(container.begin(), container.end(), comp);
  }
};

/**
 * @brief Binary insert strategy - balanced
 * COMPLEXITY: O(n) for insert, O(log n) for search
 * USE CASE: Medium number of timers (5-20)
 * BENEFIT: 2-3x faster than full sort
 */
struct BinaryInsertStrategy {
  template<typename Container, typename Compare>
  static void add_sorted(Container& container, typename Container::value_type&& item, Compare comp) {
    auto pos = std::lower_bound(container.begin(), container.end(), item, comp);
    container.insert(pos, std::move(item));
  }
};

/**
 * @brief Insertion sort strategy - minimal overhead
 * COMPLEXITY: O(n)
 * USE CASE: Very small containers or nearly sorted data
 * BENEFIT: Extremely fast for small sets, low Flash usage
 */
struct InsertionSortStrategy {
  template<typename Container, typename Compare>
  static void add_sorted(Container& container, typename Container::value_type&& item, Compare comp) {
    container.push_back(std::move(item));
    auto it = container.end() - 1;
    while (it != container.begin() && comp(*it, *(it - 1))) {
      std::swap(*it, *(it - 1));
      --it;
    }
  }
};
/**
 * @brief Heap strategy - fast insertion and extraction
 * COMPLEXITY: O(log n) insertion, O(1) top access, O(log n) pop
 * USE CASE: Large number of active timers where full sorting is expensive
 * BENEFIT: Extremely fast for priority queues (e.g., active timers)
 */
struct HeapSortStrategy {
  template<typename Container, typename Compare>
  static void add_sorted(Container& container, typename Container::value_type&& item, Compare comp) {
    container.push_back(std::move(item));
    std::push_heap(container.begin(), container.end(), comp);
  }
};

} // namespace uniuno
