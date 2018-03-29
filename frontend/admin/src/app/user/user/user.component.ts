import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {UsersService} from '../users.service';
import {Post} from '../../post/post';
import {User} from '../user';
import {environment} from '../../../environments/environment';


declare var window: any;

@Component({
  selector: 'app-category',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  dataUrl = environment.dataUrl;
  posts: Post[] = [];
  user: User = new User();
  task: String;
  defaultSelfProfileImgUrl = 'assets/img/user.jpg';
  selfProfileImgUrl = this.defaultSelfProfileImgUrl;

  newPassword: string;
  newPassword2: string;
  file: File;

  constructor(private usersService: UsersService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.task = params['task'];

      if (this.task === 'edit' && params['id']) {
        this.usersService.getUser(+params['id']).subscribe(user => {
          this.user = user;
          this.selfProfileImgUrl = this.dataUrl + '/img/user/' + this.user._id + '/' + this.user.profileImg;
        });
      } else if (this.task === 'self') {
        this.usersService.getSelf().subscribe(user => {
          this.user = user;
          this.selfProfileImgUrl = this.dataUrl + '/img/user/' + this.user._id + '/' + this.user.profileImg;
        });
      } else if (this.task === 'add') {
        this.user = new User();
      }
    });
  }

  setProfileImgToDefault() {
    this.selfProfileImgUrl = this.defaultSelfProfileImgUrl;
  }

  onProfileImageChange(event: any) {
    const files: FileList = event.target.files;
    this.file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const target: any = e.target;
      this.selfProfileImgUrl = target.result;
      this.user.profileImgBase64 = target.result;
    };
    reader.readAsDataURL(this.file);
  }

  saveUser() {
    let err = false;

    if (this.newPassword && (this.newPassword === this.newPassword2)) {
      this.user['newPassword'] = this.newPassword;
    } else if (this.newPassword && (this.newPassword !== this.newPassword2)) {
      alert('Passwords do not match!');
      err = true;
    }
    /*else if (!this.email.value){
     alert('Please enter e-mail address');
     err=true;
     }*/

    if (!err) {
      if (this.task === 'edit' && this.user._id  != undefined) {
        this.usersService.putUser(this.user._id, this.user).subscribe(res => {
          this.snackBar.open('Successfully updated user data.', '', {duration: 2000, });
          this.usersService.getUser(this.user._id).subscribe(user => this.user = user);
        }, error => this.snackBar.open(error, '', {duration: 2000, }));
      } else if (this.task === 'self') {
        this.usersService.putSelf(this.user).subscribe(res => {
          this.snackBar.open('Successfully updated your user data.', '', {duration: 2000, });
          this.usersService.getSelf().subscribe(user => this.user = user);
        }, error => this.snackBar.open(error, '', {duration: 2000, }));
      } else if (this.task === 'add' && this.user['newPassword']) {
        this.usersService.postUser(this.user).subscribe(res => {
          this.snackBar.open('Successfully added a new user.');
        }, error => this.snackBar.open(error, '', {duration: 2000, }));
      }
    }
  }

}
