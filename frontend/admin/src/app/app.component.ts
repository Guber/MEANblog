import { Component, ViewChild, OnInit } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { UsersService } from './user/users.service';
import { LoginComponent } from './login/login.component';
import { User } from './user/user';
import { environment } from '../environments/environment';
import {NavigationEnd, NavigationStart, Router, Event as NavigationEvent} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  dataUrl = environment.dataUrl;
  title = 'app';
  selfUser: User;
  defaultSelfProfileImgUrl = '/assets/img/user.jpg';
  selfProfileImgUrl = this.defaultSelfProfileImgUrl;
  navigationUrl: String;
  breadcrumbs: Array<String>;

  constructor(private usersService: UsersService, private router: Router) {

    router.events.forEach((event: NavigationEvent) => {

      if (event instanceof NavigationEnd) {
        this.navigationUrl = event.url;
        this.breadcrumbs = [];

      }
    });
  }


  ngOnInit() {
    if (localStorage.getItem('auth_token')) {
      this.usersService.getSelf().subscribe(user => {
        this.selfUser = user;
        this.selfProfileImgUrl = this.dataUrl + '/img/user/' + this.selfUser._id + '/' + this.selfUser.profile_img;
      });
    }
  }

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
    this.usersService.getSelf().subscribe(user => {
      this.selfUser = user;
      this.selfProfileImgUrl = this.dataUrl + '/img/user/' + this.selfUser._id + '/' + this.selfUser.profile_img;
    });
  }

  logOut() {
    localStorage.removeItem('auth_token');
    this.selfUser = null;
  }

  setProfileImgToDefault() {
    this.selfProfileImgUrl = this.defaultSelfProfileImgUrl;
  }

  closeSidenav() {
    this.sidenav.close();
  }
}
