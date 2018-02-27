import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {User} from './user';
import {Post} from '../post/post';
import {environment} from '../../environments/environment';

@Injectable()
export class UsersService {
  usersUrl = environment.apiUrl + "users/";

  constructor(private http: Http) {
  }

  /**
   *
   * @returns {Observable<R>}
   */
  getAllUsers(limit, offset, orderBy, orderDirection, filter): Observable<User[]> {
    return this.http.get(this.usersUrl)
      .map(res => res.json() as User[]);
  }

  /**
   *
   * @returns {Observable<R>}
   */
  getUsersCount(): Observable<number> {
    return this.http.get(this.usersUrl + 'count')
      .map(res => res.json() as number);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getUser(id): Observable<User> {
    return this.http.get(this.usersUrl + id)
      .map(res => res.json() as User);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getSelf(): Observable<User> {
    let headers = new Headers();
    let authToken = localStorage.getItem("auth_token");
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `bearer ${authToken}`);
    let options = new RequestOptions({headers: headers});

    return this.http.get(this.usersUrl + 'self', options)
      .map(res => res.json() as User);
  }


  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getUserPosts(id): Observable<Post[]> {
    return this.http.get(this.usersUrl + id + '/posts/')
      .map(res => res.json() as Post[]);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  putSelf(data): Observable<any> {
    const headers = new Headers();
    const authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    const options = new RequestOptions({headers: headers});

    return this.http.put(this.usersUrl + 'self', data, options)
      .map(res => res);
  }

  putUser(id: Number, data): Observable<User> {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    let options = new RequestOptions({headers: headers});

    return this.http.put(this.usersUrl + id, data, options)
      .map(res => res).catch(this.handleError);
  }

  postUser(data): Observable<User> {
    let headers = new Headers();
    let authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.usersUrl, data, options)
      .map(res => res).catch(this.handleError);
  }

  deleteUser(id: number): Observable<any> {
    const headers = new Headers();
    const authToken = localStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    const options = new RequestOptions({headers: headers});
    return this.http.delete(this.usersUrl + id, options)
      .map(res => res);
  }

  checkUser(): Observable<any> {
    let headers = new Headers();
    let authToken = localStorage.getItem("auth_token");
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    let options = new RequestOptions({headers: headers});


    return this.http.get(this.usersUrl + 'check', options)
      .map(res => res.json().data.admin as boolean);

  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }




}
