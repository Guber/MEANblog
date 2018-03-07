export class Post {
  _id: Number;
  title: String;
  summary: String;
  body: String;
  mainImg: String;
  images: Array<String>;
  tags: Array<String>;
  author: String;
  authorId: number;
  categoryId: number;
  createdAt: Date;
}
