import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { CategoriesService } from '../categories.service';
import { UsersService } from '../users.service';
import { Post } from '../post';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  // instantiate posts to an empty array
  posts: Post[] = [];
  postLimit: number;
  postCount: number;
  usersCount: number;
  constructor(private postsService: PostsService, private categoriesService: CategoriesService, private usersService: UsersService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.postLimit = 5;
    this.postsService.getAllPosts(this.postLimit).subscribe(posts => {
    this.posts = posts;
    });
    this.postsService.getPostsCount().subscribe(count => {
      this.postCount = count;
    });
    this.usersService.getUsersCount().subscribe(count => {
      this.usersCount = count;
    });
  }

  enlargeLimit() {
    this.postLimit = this.postLimit + 5 > this.postCount ? this.postCount : this.postLimit + 5;
    this.postsService.getAllPosts(this.postLimit).subscribe(posts => {
      this.posts = posts;
    });
  }
}
