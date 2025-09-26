export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  encryptedContent: string;
  createdAt: string;
  updatedAt: string;
}