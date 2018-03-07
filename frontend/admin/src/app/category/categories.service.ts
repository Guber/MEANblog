import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Category} from './category';
import {Post} from '../post/post';
import {environment} from '../../environments/environment';

@Injectable()
export class CategoriesService {
  categoriesUrl = environment.apiUrl + 'categories/';

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get(this.categoriesUrl)
      .map(res => res as Category[]);
  }

  getCategory(id): Observable<Category> {
    return this.http.get(this.categoriesUrl + id)
      .map(res => res as Category);
  }

  getCategoryPosts(id): Observable<Post[]> {
    return this.http.get(this.categoriesUrl + id + '/posts')
      .map(res => res as Post[]);
  }

  postExisting(id: number, data): Observable<any> {
    return this.http.put(this.categoriesUrl + id, data)
      .map(res => res).catch(this.handleError);
  }

  postNew(data): Observable<any> {
    return this.http.post(this.categoriesUrl, data)
      .map(res => res).catch(this.handleError);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(this.categoriesUrl + id)
      .map(res => res);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
