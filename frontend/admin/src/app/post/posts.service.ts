import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../environments/environment';
import {Post} from './post';

@Injectable()
export class PostsService {
  postsUrl = environment.apiUrl + "posts/";

  constructor(private http: Http) {
  }

  getAllPosts(limit, offset, orderBy, orderDirection, filter): Observable<Post[]> {
    return this.http.get(this.postsUrl + '?limit=' + limit + '&offset=' + offset + '&order_by=' + orderBy + '&order_direction=' + orderDirection + '&filter=' + filter)
      .map(res => res.json() as Post[]);
  }

  getPostsCount(): Observable<number> {
    return this.http.get(this.postsUrl + '/count')
      .map(res => res.json() as number);
  }

  getPost(id): Observable<Post> {
    return this.http.get(this.postsUrl + id)
      .map(res => res.json() as Post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(this.postsUrl + id)
      .map(res => res.json());
  }

  deletePostImage(id: number, img: string): Observable<any> {
    return this.http.delete(this.postsUrl + id + '/newImages/' + img)
      .map(res => res.json());
  }

  postExisting(id: number, data): Observable<any> {
    return this.http.put(this.postsUrl + id, data)
      .map(res => res.json()).catch(this.handleError);
  }

  postNew(data): Observable<any> {
    return this.http.post(this.postsUrl, data)
      .map(res => res.json()).catch(this.handleError);
  }

  postPostImage(id: number, data): Observable<any> {
    return this.http.post(this.postsUrl + id + '/newImages/', data)
      .map(res => res.json()).catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
