
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
    videourl: string;
    createdAt?:Date;
}
