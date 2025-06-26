export interface HealthRecord {
  id: string
  title: string
  category: RecordCategory
  date: string
  description?: string
  tags: string[]
  file_url?: string
  file_name?: string
  file_type?: string
  file_size?: number
  ocr_text?: string
  privacy_level: "private" | "family" | "shared"
  created_at: string
  updated_at: string
  user_id: string
}

export type RecordCategory =
  | "prescription"
  | "lab_report"
  | "xray"
  | "mri"
  | "ct_scan"
  | "ultrasound"
  | "vaccination"
  | "consultation"
  | "surgery"
  | "insurance"
  | "other"

export interface RecordFilter {
  category?: RecordCategory
  dateFrom?: string
  dateTo?: string
  tags?: string[]
  searchQuery?: string
}

export interface UploadProgress {
  file: File
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
}
