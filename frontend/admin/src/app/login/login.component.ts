import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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

  @Output() token = new EventEmitter<string>();

  submitLogIn() {
    const data = {};
    if (this.name && this.password) {
      data['name'] = this.name;
      data['password'] = this.password;
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
