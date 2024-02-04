export class PostModel {
    _id: string = '';
    createdBy: string = '';
    text: string = '';
    likes: string[] = [];
    createdAt: Date = new Date();
}