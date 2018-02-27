import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Category } from './category';
import { Post } from './post';

@Injectable()
export class CategoriesService {

  constructor(private http: Http) { }

  /**
   *
   * @returns {Observable<R>}
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get('http://localhost:3000/api/categories')
      .map(res => res.json() as Category[]);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getCategory(id): Observable<Category> {
    return this.http.get('http://localhost:3000/api/categories/' + id)
      .map(res => res.json() as Category);
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  getCategoryPosts(id): Observable<Post[]> {
    return this.http.get('http://localhost:3000/api/categories/' + id + '/posts')
      .map(res => res.json() as Post[]);
  }

}
