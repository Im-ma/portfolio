export type SampleStatus = "passed" | "invalid" | "warning";

export type SampleIssue =
  "none" | "missing label" | "invalid dimensions" | "duplicate" | "low resolution";

export type SampleSplit = "train" | "validation" | "test";

export type SampleRecord = {
  id: string;
  file: string;
  split: SampleSplit;
  status: SampleStatus;
  issue: SampleIssue;
  rule: string;
  plain: string;
  width: number;
  height: number;
  label: string;
};

const pass = {
  status: "passed" as const,
  issue: "none" as const,
  rule: "",
  plain: "No issue on this sample record.",
  width: 1280,
  height: 720,
};

export const sampleRecords: SampleRecord[] = [
  {
    id: "rec_demo_01",
    file: "demo_frame_01.jpg",
    split: "train",
    label: "demo-cube",
    ...pass,
  },
  {
    id: "rec_demo_02",
    file: "demo_frame_02.jpg",
    split: "train",
    label: "demo-cone",
    ...pass,
  },
  {
    id: "rec_demo_03",
    file: "demo_frame_03.jpg",
    split: "validation",
    status: "invalid",
    issue: "missing label",
    rule: "ANNOTATION_REQUIRED",
    plain: "The label field is empty. Every frame needs a verified annotation before training.",
    width: 1280,
    height: 720,
    label: "",
  },
  {
    id: "rec_demo_04",
    file: "demo_frame_04.jpg",
    split: "test",
    label: "demo-sign",
    ...pass,
  },
  {
    id: "rec_demo_05",
    file: "demo_frame_05.jpg",
    split: "train",
    status: "invalid",
    issue: "invalid dimensions",
    rule: "",
    plain: "An impossible image size.",
    width: 0,
    height: 0,
    label: "demo-pole",
  },
  {
    id: "rec_demo_06",
    file: "demo_frame_06.jpg",
    split: "validation",
    status: "warning",
    issue: "low resolution",
    rule: "",
    plain: "Low resolution.",
    width: 320,
    height: 180,
    label: "demo-lane",
  },
  {
    id: "rec_demo_07",
    file: "demo_frame_02.jpg",
    split: "train",
    status: "invalid",
    issue: "duplicate",
    rule: "",
    plain: "A duplicate frame.",
    width: 1280,
    height: 720,
    label: "demo-cone",
  },
  {
    id: "rec_demo_08",
    file: "demo_frame_08.jpg",
    split: "test",
    label: "demo-tree",
    ...pass,
  },
  {
    id: "rec_demo_09",
    file: "demo_frame_09.jpg",
    split: "train",
    label: "demo-truck",
    ...pass,
  },
  {
    id: "rec_demo_10",
    file: "demo_frame_10.jpg",
    split: "validation",
    label: "demo-curb",
    ...pass,
    width: 1920,
    height: 1080,
  },
  {
    id: "rec_demo_11",
    file: "demo_frame_11.jpg",
    split: "test",
    status: "invalid",
    issue: "missing label",
    rule: "ANNOTATION_REQUIRED",
    plain: "The label field is empty. Every frame needs a verified annotation before training.",
    width: 1280,
    height: 720,
    label: "",
  },
  {
    id: "rec_demo_12",
    file: "demo_frame_12.jpg",
    split: "train",
    status: "warning",
    issue: "low resolution",
    rule: "",
    plain: "Low resolution.",
    width: 240,
    height: 135,
    label: "demo-curb",
  },
];

export function recordJson(record: SampleRecord) {
  return JSON.stringify(
    {
      id: record.id,
      file: record.file,
      label: record.label,
      width: record.width,
      height: record.height,
      split: record.split,
    },
    null,
    2,
  );
}

export function blockingCount(records: SampleRecord[]) {
  return records.filter((record) => record.status === "invalid").length;
}
