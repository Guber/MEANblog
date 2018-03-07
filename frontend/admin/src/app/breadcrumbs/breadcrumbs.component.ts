import {Component, Input, OnInit} from '@angular/core';
import {Breadcrumb} from './breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
  _currentUrl: String;
  breadcrumbs: Array<Breadcrumb>;

  constructor() {
  }

  @Input()
  set currentUrl(currentUrl: string) {
    this._currentUrl = currentUrl;
    this.breadcrumbs = [];
    switch (currentUrl) {
      case '/home': {
        this.breadcrumbs.push(new Breadcrumb('Posts', '/posts'));
        break;
      }
      case '/posts': {
        this.breadcrumbs.push(new Breadcrumb('Posts', '/posts'));
        break;
      }
      case '/users': {
        this.breadcrumbs.push(new Breadcrumb('Users', '/users'));
        break;
      }
      case '/users/add': {
        this.breadcrumbs.push(new Breadcrumb('Users', '/users'));
        this.breadcrumbs.push(new Breadcrumb('Add a new user', '/users/add'));
        break;
      }
      case '/users/self': {
        this.breadcrumbs.push(new Breadcrumb('Users', '/users'));
        this.breadcrumbs.push(new Breadcrumb('Edit your user data', '/users/self'));
        break;
      }
      case '/categories': {
        this.breadcrumbs.push(new Breadcrumb('Categories', '/categories'));
        break;
      }
      case '/post/add': {
        this.breadcrumbs.push(new Breadcrumb('Posts', '/posts'));
        this.breadcrumbs.push(new Breadcrumb('Add a new post', '/posts/add'));
        break;
      }
      default: {
        if (currentUrl.indexOf('post/copy/') !== -1) {
          this.breadcrumbs.push(new Breadcrumb('Posts', '/posts'));
          this.breadcrumbs.push(new Breadcrumb('Copy post ' + currentUrl.replace('/post/copy/', ''), currentUrl));
        } else if (currentUrl.indexOf('post/edit/') !== -1) {
          this.breadcrumbs.push(new Breadcrumb('Posts', '/posts'));
          this.breadcrumbs.push(new Breadcrumb('Edit post ' + currentUrl.replace('/post/edit/', ''), currentUrl));
        } else if (currentUrl.indexOf('categories/edit/') !== -1) {
          this.breadcrumbs.push(new Breadcrumb('Categories', '/categories'));
          this.breadcrumbs.push(new Breadcrumb('Edit category ' + currentUrl.replace('/categories/edit/', ''), currentUrl));
        } else if (currentUrl.indexOf('users/edit/') !== -1) {
          this.breadcrumbs.push(new Breadcrumb('Users', '/users'));
          this.breadcrumbs.push(new Breadcrumb('Edit user ' + currentUrl.replace('/users/edit/', ''), currentUrl));
        }
      }
    }
  }

  ngOnInit() {
  }


}
