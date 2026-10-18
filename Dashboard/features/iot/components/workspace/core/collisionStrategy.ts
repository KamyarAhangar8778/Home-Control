import {
  pointerWithin,
  closestCorners,
  CollisionDetection,
  getFirstCollision
} from "@dnd-kit/core";

/**
 * Optimized Collision Detection Strategy
 * 1. First checks if the pointer is hovering directly over a droppable element. (Very fast O(n) bounds check)
 * 2. If no direct hover is found (e.g., when dragging an item outside the grid), it falls back to closestCorners.
 */
export const optimizedCollisionDetection: CollisionDetection = (args) => {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collisions that are directly under the pointer
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return closest corners fallback
  return closestCorners(args);
};
