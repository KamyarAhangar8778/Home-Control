import React, { useState } from "react";
import { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import { motion, AnimatePresence } from "motion/react";
import LeftIsland from "./LeftIsland";

export default function HorizontalHeader(props: MasterHeaderProps) {
  const [isSubIslandOpen, setIsSubIslandOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3 relative z-20 text-right font-sans" dir="rtl">
      <div
        id="horizontal-master-header"
        className="w-full flex flex-col md:flex-row gap-4 items-stretch"
      >
        <BrandBox
          headerTitle={props.headerTitle}
          variant="horizontal"
          isDark={props.isDark}
          setIsDark={props.setIsDark}
          animationsEnabled={props.animationsEnabled}
          setIsModulesMenuOpen={props.setIsModulesMenuOpen}
          setIsMenuOpen={props.setIsMenuOpen}
          groupsCols={props.groupsCols}
          setGroupsCols={props.setGroupsCols}
          groupsOrder={props.groupsOrder}
          selectedGroupFilter={props.selectedGroupFilter}
          setSelectedGroupFilter={props.setSelectedGroupFilter}
        />

        <LeftIsland 
          props={props} 
          isSubIslandOpen={isSubIslandOpen} 
          setIsSubIslandOpen={setIsSubIslandOpen} 
        />
      </div>

      <AnimatePresence>
        {isSubIslandOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3 rounded-2xl shadow-sm flex items-center justify-between gap-4 overflow-hidden"
          >
            {/* Empty for now */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
