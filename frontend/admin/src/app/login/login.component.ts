import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, Validators} from '@angular/forms';

declare let window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;
  usernameFormControl = new FormControl('', [
    Validators.required,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(private authService: AuthService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // random messages container

    // random newImages url container
    /*
    const newImages = [
      'url(\'/assets/img/solar-panel-array-power-plant-electricity-power-159160.jpeg\')',
      'url(\'/assets/img/hill-2165759_1920.jpg\')',
      'url(\'/assets/img/tianjin-2185510_1920.jpg\')',
      'url(\'/assets/img/freezing-earth-2376303_1920.jpg\')'
    ];

    const random_image = Math.floor(newImages.length * Math.random());
    document.body.style.backgroundImage = newImages[random_image];
    */
  }

  @Output() token = new EventEmitter<string>();

  submitLogIn() {
    const data = {};
    if (this.name && this.password) {
      data['name'] =  this.name;
      data['password'] =  this.password;
      this.authService.submitLogIn(data).subscribe(response => {
        this.token.emit(response.token);
      }, error => {
        if (error === 'Provided password doesn\'t match.') {
          this.passwordFormControl.setErrors({'incorrect': true});
        } else if (error === 'No such user found.') {
          this.usernameFormControl.setErrors({'incorrect': true});
        } else {
          alert(error);
        }
      });
    }
  }

}
