import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  isSpinner:boolean = false

  onSubmit(f:NgForm) {
    this.isSpinner = true
    const { email, password } = f.form.value;

    this.auth.signIn(email, password)
    .then((res) => {
      this.toastr.success("Sign In Success");
      this.router.navigateByUrl('/')
      this.isSpinner = false;
    })
    .catch((err) => {
      this.toastr.error(err.message, '', {
        closeButton: true,
      });
      this.isSpinner = false;
    });

  }




}
