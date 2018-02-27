import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from './user';
import { Post } from './post';

@Injectable()
export class UsersService {

  constructor(private http: Http) { }

  /**
   *
   * @returns {Observable<R>}
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get('http://localhost:3000/api/users')
      .map(res => res.json() as User[]);
  }

  /**
   *
   * @returns {Observable<R>}
   */
  getUsersCount(): Observable<number> {
    return this.http.get('http://localhost:3000/api/users/count')
      .map(res => res.json() as number);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getUser(id): Observable<User> {
    return this.http.get('http://localhost:3000/api/users/' + id)
      .map(res => res.json() as User);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getUserPosts(id): Observable<Post[]> {
    return this.http.get('http://localhost:3000/api/users/' + id + '/posts/')
      .map(res => res.json() as Post[]);
  }



}
