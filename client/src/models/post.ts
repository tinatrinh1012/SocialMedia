export class PostModel {
    _id: string = '';
    createdBy: string = '';
    text: string = '';
    likes: number = 0;
    createdAt: Date = new Date();
}