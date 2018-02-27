import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post';
import { User } from '../user';

@Component({
  selector: 'app-category',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  posts: Post[] = [];
  user: User;

  constructor(private usersService: UsersService, private route: ActivatedRoute) {  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.usersService.getUserPosts(+params['id']).subscribe(posts => {
        this.posts = posts;
      });
      this.usersService.getUser(+params['id']).subscribe(user => {
        this.user = user;
      });
    });
  }

}
