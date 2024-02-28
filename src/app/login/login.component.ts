import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  unmatched: boolean = false;
  hidePassword: boolean = true;


  constructor(private fb: FormBuilder, private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifiant: ['', Validators.required],
      motDePasse: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  test() {
    if (this.loginForm.valid) {
      // if (this.loginForm.value.motDePasse != this.loginForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      const data = {
        username: this.loginForm.value.identifiant,
        password: this.loginForm.value.motDePasse
      }
      this.userservice.login({ data }).subscribe(
        response => {
          console.log("success");
          console.log(response);
          const user = response.body.user;
          localStorage.setItem('token', btoa(user.role));
          localStorage.setItem('username', user.username);
          window.location.reload();
          this.router.navigate(['/']);

        },
        error => {
          this.showNotification(error.error.error, 'danger');
          console.log(error);
        }
      );
    } else {
      console.log("not valid");
      this.markFormGroupTouched(this.loginForm);
    }
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  showNotification(message: string, type: string) {
    // const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: message

    }, {
      type: type,
      timer: 4000,
      placement: {
        from: 'top',
        align: 'center'
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }

}
