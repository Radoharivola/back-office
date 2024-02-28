import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  employeeForm: FormGroup;
  unmatched: boolean = false;

  fileEmpty: boolean = false;

  employee: any;

  files: File[] = [];
  image: any;
  constructor(private userservice: UserService, private fb: FormBuilder, private sanitizer: DomSanitizer, private route: Router) { }

  ngOnInit() {
    this.fetchEmp();
  }
  fetchEmp() {
    this.userservice.myProfile().subscribe(data => {
      this.employee = data.body.employee;
      console.log(this.employee.lastName);
      this.initForm();
      const base64Image = data.body.profilePicture;
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const imageFile = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
      this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageFile));
      this.files = [];
      this.files.push(imageFile);
      console.log(this.files[0]);
    }, err => {
      this.userservice.logout().subscribe(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.route.navigate(['/login']);
      }, err => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.route.navigate(['/login']);
        console.log(err);
      });
      console.log(err);
    });
  }
  initForm() {

    this.employeeForm = this.fb.group({
      nom: [this.employee.lastName, Validators.required],
      prenom: [this.employee.firstName, Validators.required],
      email: [this.employee.email, [Validators.required, Validators.email]],
      identifiant: [this.employee.username, Validators.required],
      telephone: [this.employee.phone, Validators.required],
      motDePasse: ['aze'],
      confirmerMotDePasse: ['aze']
    });
  }


  onSelect(event) {
    this.files = [];
    this.files.push(...event.addedFiles);
    const formData = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i]);
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSubmit() {
    if (this.files.length === 0) {
      this.fileEmpty = true;
      setTimeout(() => {
        this.fileEmpty = false;
      }, 5000);
      return;
    }
    if (this.employeeForm.value.motDePasse === this.employeeForm.value.confirmerMotDePasse) {
      console.log("null" );
    } else {
      this.showNotification("Les mdp ne correspondent pas!", 'danger');

      return;
    }
    if (this.employeeForm.valid) {
      // if (this.employeeForm.value.motDePasse != this.employeeForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }

      const formData = new FormData();
      formData.append('pic', this.files[0]);
      formData.append('username', this.employeeForm.value.identifiant);
      formData.append('password', this.employeeForm.value.motDePasse);
      formData.append('role', this.employee.role.roleName);
      formData.append('firstName', this.employeeForm.value.prenom);
      formData.append('lastName', this.employeeForm.value.nom);
      formData.append('email', this.employeeForm.value.email);
      formData.append('phone', this.employeeForm.value.telephone);
      console.log(formData);
      this.userservice.updateEmployee({ 'formData': formData, 'id': this.employee._id }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;

          console.log(response);
          this.showNotification(response.message, 'success');
          this.fetchEmp();
        },
        error => {
          // this.success = false;
          // this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 5000);
          // this.message = error.error.message;
          this.showNotification(error.error.error, 'danger');

          console.log(error.error.error);
        }
      );
    } else {
      this.markFormGroupTouched(this.employeeForm);
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
