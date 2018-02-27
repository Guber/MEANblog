import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  postsUrl = environment.apiUrl;

  constructor(private http: Http) {
  }

  submitLogIn(data): Observable<any> {
    return this.http.post(this.postsUrl + "auth/login", data)
      .map(res => res.json()).catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.json().message) ? error.json().message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
