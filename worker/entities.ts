import { IndexedEntity } from "./core-utils";
import type { DiaryEntry } from "@shared/types";
// DIARY ENTRY ENTITY: one DO instance per entry
export class DiaryEntryEntity extends IndexedEntity<DiaryEntry> {
  static readonly entityName = "diaryEntry";
  // A base name for user-specific indexes, to satisfy the base class contract.
  static readonly indexName = "diaryEntries_by_user";
  // A new static method to generate the actual user-specific index name.
  static getUserIndexName(userId: string) {
    return `diaryEntries_by_user_${userId}`;
  }
  static readonly initialState: DiaryEntry = {
    id: "",
    userId: "",
    title: "",
    encryptedContent: "",
    createdAt: "",
    updatedAt: "",
  };
}