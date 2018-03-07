export class Post {
  _id: number;
  title: String;
  summary: String;
  body: String;
  mainImg: String;
  images: Array<String>;
  tags: Array<String>;
  authorId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  hidden: Boolean;
}
