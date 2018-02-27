import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';

import { DatePipe } from '@angular/common';
import { PostsService } from './posts.service';
import { CategoriesService } from './categories.service';
import { UsersService } from './users.service';
import { CategoryComponent } from './category/category.component';
import { UserComponent } from './user/user.component';
import { PostssearchComponent } from './postssearch/postssearch.component';
import { LoginComponent } from './login/login.component';


const ROUTES = [
  {
    path: '',
    redirectTo: 'posts',
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
    path: 'post/:id',
    component: PostComponent
  },
  {
    path: 'category/:id',
    component: CategoryComponent
  },{
    path: 'user/:id',
    component: UserComponent
  },
  {
    path: 'posts-search',
    component: PostssearchComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    PostComponent,
    CategoryComponent,
    UserComponent,
    PostssearchComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
   providers: [PostsService, CategoriesService, UsersService, DatePipe],
   bootstrap: [AppComponent]
})
export class AppModule { }
