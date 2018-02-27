import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';
import { CategoriesService } from '../categories.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post';
import { User } from '../user';
import { Category } from '../category';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  posts: Array<Post> = [];
  post: Post;
  author: User;
  category: Category;
  dataUrl = environment.dataUrl;

  galleryModalImg: String = '';
  galleryModalDisplay: Boolean = false;
  constructor(private postsService: PostsService, private usersService: UsersService, private categoryService: CategoriesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postsService.getPost(+params['id']).subscribe(post => {
        this.post = post;

        this.usersService.getUser(this.post.author_id).subscribe(user => {
          this.author = user;
        });

        this.usersService.getUserPosts(this.post.author_id).subscribe(posts => {
          this.posts = posts.filter(function (post){return post._id != +params['id'];});
        });

        this.categoryService.getCategory(this.post.category_id).subscribe(category => {
          this.category = category;
        });
      });
    });
  }

  setGalleryImage(imgSrc: String): void {
    this.galleryModalImg = imgSrc;
    this.galleryModalDisplay = true;
  }

}
