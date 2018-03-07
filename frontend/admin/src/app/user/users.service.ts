import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {User} from './user';
import {Post} from '../post/post';
import {environment} from '../../environments/environment';

@Injectable()
export class UsersService {
  usersUrl = environment.apiUrl + "users/";

  constructor(private http: HttpClient) {
  }

  getAllUsers(limit, offset, orderBy, orderDirection, filter): Observable<User[]> {
    return this.http.get(this.usersUrl)
      .map(res => res as User[]);
  }

  getUsersCount(): Observable<number> {
    return this.http.get(this.usersUrl + 'count')
      .map(res => res as number);
  }

  getUser(id): Observable<User> {
    return this.http.get(this.usersUrl + id)
      .map(res => res as User);
  }

  getSelf(): Observable<User> {
    return this.http.get(this.usersUrl + 'self')
      .map(res => res as User);
  }

  getUserPosts(id): Observable<Post[]> {
    return this.http.get(this.usersUrl + id + '/posts/')
      .map(res => res as Post[]);
  }

  putSelf(data): Observable<any> {
    return this.http.put(this.usersUrl + 'self', data)
      .map(res => res);
  }

  putUser(id: Number, data): Observable<User> {
    return this.http.put(this.usersUrl + id, data)
      .map(res => res).catch(this.handleError);
  }

  postUser(data): Observable<User> {
    return this.http.post(this.usersUrl, data)
      .map(res => res).catch(this.handleError);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(this.usersUrl + id)
      .map(res => res);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
