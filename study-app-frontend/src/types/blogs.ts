export interface BlogsModel{
    id: number; // From AuditEntity
    title: string;
    shortDescription: string; 
    content:string;
    imageUrl?:string;
    createdAt?:Date
}

export interface Blogsdetail{
    title:string;
    content:string;
}