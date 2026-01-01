
export interface LectureDetailsModel {
    title: string;
    description: string;
    thumbnail: File | null;
    video: File | null;
}
export interface LectureDetailsResponseDto{
    id:number;
    title: string;
    description: string;
    thumbnailurl: string;
    videoUrl: string;
    createdAt?:Date;
}

export interface AssignedLectureDto{
    lectureId:number;
    lectureTitle: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    sessionId:number;
    sessionTitle:string;
    assignedAt?:Date;
}
 