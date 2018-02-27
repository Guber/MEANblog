import {MatPaginator, MatSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {PostsService} from './posts.service';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Post} from './post';
import {environment} from "../../environments/environment";


export class PostsDataSource extends DataSource<Post> {
  dataUrl = environment.dataUrl;
  private _filter: String;

  get filter(): String {
    return this._filter;
  }

  set filter(value: String) {
    this._filter = value;
    this.fetchData();
  }

  constructor(private postsService: PostsService, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
    this._filter = '';

    this.postsService.getPostsCount().subscribe(count => {
      this._paginator._length = count;
    });

    this.fetchData();

    this._sort.sortChange.subscribe(() => {
      this.fetchData();
    });

    this._paginator.page.subscribe(() => {
      this.fetchData();
    });

  }

  data = new BehaviorSubject<Post[]>([]);

  connect(): Observable<Post[]> {
    return this.data.asObservable();
  }

  disconnect() {
  }

  fetchData() {
    const offset = this._paginator.pageIndex * this._paginator.pageSize;

    this.postsService.getAllPosts(this._paginator.pageSize, offset, this._sort.active, this._sort.direction, this._filter).subscribe(posts => {

      posts.forEach((post) => {
       post.main_img = this.dataUrl + '/img/posts/' + post._id + '/' + post.main_img;
      });

      this.data.next(posts);
    });
  }

  deletePost(postId) {
    this.postsService.deletePost(postId).subscribe(complete => {
      this.fetchData();
    });
  }
}
