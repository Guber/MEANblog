import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatSort, MatPaginator} from '@angular/material';
import 'rxjs/add/operator/map';

import {PostsService} from '../posts.service';
import {Post} from '../post';
import {environment} from '../../../environments/environment';
import {PostsDataSource} from '../posts.datasource';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataUrl = environment.dataUrl;
  posts: Post[];
  displayedColumns = ['_id', 'created', 'author', 'title', 'thumbnail', 'actions'];
  dataSource: PostsDataSource | null;
  totalPages: number;
  private defaultPostImgUrl = '/assets/img/image.png';

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.postsService.getPostsCount().subscribe(count => {
      this.totalPages = count;
    });

    this.dataSource = new PostsDataSource(this.postsService, this.sort, this.paginator);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  deletePost(post) {
    if (confirm('You sure you want to delete this post?')) {
      this.dataSource.deletePost(post._id);
    }
  }

  setPostImgToDefault(post) {
    post.main_img = this.defaultPostImgUrl;
  }
}
