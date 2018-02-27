import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post';

@Component({
  selector: 'app-postssearch',
  templateUrl: './postssearch.component.html',
  styleUrls: ['./postssearch.component.css']
})

export class PostssearchComponent implements OnInit {
  // instantiate posts to an empty array
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchString: String = "";
  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getAllPosts(0).subscribe(posts => {
      this.posts = this.filteredPosts =  posts;
    });
  }

  filterByString(): void {
    var searchString: String = this.searchString;
    function isFound(element) {
      var found: Boolean = false;
      found = element.title.toLowerCase().search(searchString.toLowerCase()) != -1;
      if (!found) {
        found = element.summary.toLowerCase().search(searchString.toLowerCase()) != -1;
      }
      if (!found) {
        found = element.body.toLowerCase().search(searchString.toLowerCase()) != -1;
      }
      if (!found) {
        for (var i = 0; i < element.tags.length; i++) {
          found = element.tags[i].toLowerCase().search(searchString.toLowerCase()) != -1;
          if (found) {
            break;
          }
        }
      }

      return found;
    }

    this.filteredPosts = this.posts.filter(isFound);
  }


}
