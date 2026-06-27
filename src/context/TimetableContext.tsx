import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { mockData } from "../data/mockData";
import type { Group, ClassBlock } from "../data/mockData";

interface TimetableContextType {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  classBlocks: ClassBlock[];
  setClassBlocks: React.Dispatch<React.SetStateAction<ClassBlock[]>>;
  academicYears: typeof mockData.academicYears;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(mockData.groups);
  const [classBlocks, setClassBlocks] = useState<ClassBlock[]>(mockData.classBlocks);

  return (
    <TimetableContext.Provider
      value={{
        groups,
        setGroups,
        classBlocks,
        setClassBlocks,
        academicYears: mockData.academicYears,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error("useTimetable must be used within a TimetableProvider");
  }
  return context;
};
