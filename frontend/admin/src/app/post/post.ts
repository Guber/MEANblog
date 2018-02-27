export class Post {
  _id: number;
  title: String;
  summary: String;
  body: String;
  main_img: String;
  images: Array<String>;
  tags: Array<String>;
  author: String;
  author_id: number;
  category_id: number;
  created: Date;
}
