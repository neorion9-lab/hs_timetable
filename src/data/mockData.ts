export interface AcademicYear {
  year_id: string;
  label: string;
  startDate: string;
  endDate: string;
  holidays: string[];
}

export interface Group {
  group_id: string;
  name: string;
  dynamic: boolean;
  memberGradeIds: string[];
}

export interface TemplateBlock {
  templateBlockId: string;
  days: string[];
  periods: number[];
  baselineSubjects: string[];
  rooms: string[];
}

export interface TemplateSet {
  templateSetId: string;
  name: string;
  templateBlocks: TemplateBlock[];
}

export interface TemplateAssignment {
  group_id: string;
  templateBlockIds: string[];
}

export interface ClassBlock {
  block_id: string;
  year_id: string;
  subject_id: string;
  teacher_id: string;
  room_id: string;
  group_id: string;
  class_num?: number;
  day_of_week: string;
  period_start: number;
  duration: number;
  isExternal: boolean;
}

export const mockData = {
  academicYears: [
    {
      year_id: "2026",
      label: "2026학년도",
      startDate: "2026-03-01",
      endDate: "2027-02-28",
      holidays: ["2026-05-05", "2026-09-24", "2026-10-09"],
    },
  ],
  groups: [],
  templateSets: [
    {
      templateSetId: "TPL_BASE",
      name: "기본 뼈대",
      templateBlocks: [
        {
          templateBlockId: "TB_A1",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          periods: [1, 2],
          baselineSubjects: ["SUB001", "SUB002"],
          rooms: ["R001", "R002"],
        },
        {
          templateBlockId: "TB_A2",
          days: ["Mon", "Wed", "Fri"],
          periods: [3, 4],
          baselineSubjects: ["SUB003"],
          rooms: ["R001"],
        },
        {
          templateBlockId: "TB_B1",
          days: ["Tue", "Thu"],
          periods: [1, 2, 3],
          baselineSubjects: ["SUB004", "SUB005"],
          rooms: ["R003"],
        },
      ],
    },
  ],
  templateAssignments: [],
  classBlocks: [],
};
