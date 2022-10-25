import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email = null;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
    ) {
      auth.getUser().subscribe((user:any) => {
        this.email = user?.email;
        console.log("USER IS: ", user)
      })
    }

  ngOnInit(): void {
  }

  async handleSignOut() {
    try {
      await this.auth.signOut();
      this.email = null;
      this.toastr.info("Logout Successful");
      this.router.navigateByUrl("/signin");
    } catch {
      this.toastr.error("Problem in signout");
    }
  }
}
