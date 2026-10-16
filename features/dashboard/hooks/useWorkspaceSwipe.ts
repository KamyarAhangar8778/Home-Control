import { useState } from 'react';

export function useWorkspaceSwipe(
  selectedGroupFilter: string | null,
  setSelectedGroupFilter: (val: string | null) => void,
  groupsOrder: string[]
) {
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Only trigger horizontal swipe if X movement is greater than Y movement
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      
      if (isLeftSwipe || isRightSwipe) {
        const allGroups = [null, ...groupsOrder];
        const currIndex = allGroups.findIndex((g) => g === selectedGroupFilter);
        const safeCurrIndex = currIndex === -1 ? 0 : currIndex;
        
        if (isRightSwipe) {
          const nextIndex = (safeCurrIndex + 1) % allGroups.length;
          setSelectedGroupFilter(allGroups[nextIndex]);
        } else if (isLeftSwipe) {
          const prevIndex = (safeCurrIndex - 1 + allGroups.length) % allGroups.length;
          setSelectedGroupFilter(allGroups[prevIndex]);
        }
      }
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}
