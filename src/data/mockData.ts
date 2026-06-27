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
  day_of_week: string;
  period_start: number;
  duration: number;
  isExternal: boolean;
}

export const mockData = {
  academicYears: [
    {
      year_id: "2025-2026",
      label: "2025-2026 학사연도",
      startDate: "2025-03-01",
      endDate: "2026-02-28",
      holidays: ["2025-04-01", "2025-04-02", "2025-05-05"],
    },
  ],
  groups: [
    {
      group_id: "GRP_A",
      name: "그룹 A",
      dynamic: true,
      memberGradeIds: ["G1", "G2"],
    },
    {
      group_id: "GRP_B",
      name: "그룹 B",
      dynamic: true,
      memberGradeIds: ["G3", "G4", "G5", "G6"],
    },
  ],
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
  templateAssignments: [
    { group_id: "GRP_A", templateBlockIds: ["TB_A1", "TB_A2"] },
    { group_id: "GRP_B", templateBlockIds: ["TB_B1"] },
  ],
  classBlocks: [
    {
      block_id: "CB001",
      year_id: "2025-2026",
      subject_id: "SUB001",
      teacher_id: "T001",
      room_id: "R001",
      group_id: "GRP_A",
      day_of_week: "Mon",
      period_start: 1,
      duration: 2,
      isExternal: false,
    },
    {
      block_id: "CB002",
      year_id: "2025-2026",
      subject_id: "SUB003",
      teacher_id: "T002",
      room_id: "R002",
      group_id: "GRP_B",
      day_of_week: "Tue",
      period_start: 3,
      duration: 2,
      isExternal: true,
    },
  ],
};
