import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';

import { AppComponent } from './app.component';
import { PostsComponent } from './post/posts/posts.component';
import { PostComponent } from './post/post/post.component';

import { DatePipe } from '@angular/common';
import { AuthService } from './auth.service';
import { PostsService } from './post/posts.service';
import { CategoriesService } from './category/categories.service';
import { UsersService } from './user/users.service';
import { AuthInterceptor} from './auth-interceptor';

import { CategoryComponent } from './category/category/category.component';
import { UserComponent } from './user/user/user.component';
import { LoginComponent } from './login/login.component';
import {UsersComponent} from "./user/users/users.component";
import {CategoriesComponent} from "./category/categories/categories.component";
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';


const ROUTES = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: PostsComponent
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'post/:task',
    component: PostComponent
  },
  {
    path: 'post/:task/:id',
    component: PostComponent
  },
  {
    path: 'categories/add',
    component: CategoryComponent
  },
  {
    path: 'categories/:task/:id',
    component: CategoryComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'users/:task/:id',
    component: UserComponent
  },
  {
    path: 'users/:task',
    component: UserComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    PostComponent,
    CategoryComponent,
    CategoriesComponent,
    UserComponent,
    UsersComponent,
    LoginComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
   providers: [AuthService, PostsService, CategoriesService, UsersService, DatePipe,
     {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor,
       multi: true
     }],
   bootstrap: [AppComponent]
})
export class AppModule { }
