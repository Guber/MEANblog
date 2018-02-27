import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Post } from './post';
import { environment } from '../environments/environment';

@Injectable()
export class PostsService {
  postsUrl = environment.apiUrl + "posts/";
  constructor(private http: Http) { }


  /**
   *
   * @param limit
   * @returns {Observable<R>}
   */
  getAllPosts(limit): Observable<Post[]> {
    return this.http.get(this.postsUrl + '?limit=' + limit)
      .map(res => res.json() as Post[]);
  }

  /**
   *
   * @returns {Observable<R>}
   */
  getPostsCount(): Observable<number>{
    return this.http.get(this.postsUrl + '/count')
      .map(res => res.json() as number);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getPost(id): Observable<Post> {
    return this.http.get(this.postsUrl + id)
      .map(res => res.json() as Post);
  }
}
