export interface CreatePaperModel {
  title: string;
  testConductionDate: string;
  durationMinutes: number;
  subjectName: string;
}


export interface PaperModel {
    id: number; // From AuditEntity
    title: string;
    subjectName: string;
    testConductedOn: Date; // Can also use string if it's serialized as ISO date from backend
    questions: QuestionModel[];
}

export interface QuestionModel{
    id: number;
}