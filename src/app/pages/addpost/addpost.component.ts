import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

//services
import { AuthService } from 'src/app/services/auth.service';

//angular form
import { NgForm } from '@angular/forms';

//firebase
// import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database'

//browser image resizer
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/utils/config';

// uuid/
import { v4 as uuidv4 } from 'uuid';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  locationName!: string;
  description!: string;
  picture: string = 'null';
  user:any = null;
  uploadPercent: number = 0

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {
    auth.getUser().subscribe((user: any) => {
      this.db.object(`/users/${user.uid}`)
        .valueChanges()
        .subscribe((user: any) => {
          this.user = user;
        })
    })
  }

  onSubmit() {
    const uid = uuidv4();

    this.db.object(`/posts/${uid}`)
    .set({
      id: uid,
      locationName: this.locationName,
      description : this.description,
      picture: this.picture,
      by: this.user.name,
      instaId: this.user.instaUserName,
      date: Date.now()
    })
    .then(() => {
      this.toastr.success("Post Added Successfully");
      this.router.navigateByUrl('/');
    })
    .catch((err) => {
      this.toastr.error("Ooopss")
    })

  }

  ngOnInit(): void {
  }

  async uploadFile(event:any) {
    const file = event.target.files[0];
    let resizedImage = await readAndCompressImage(file, imageConfig)

    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath)

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges()
    .subscribe((percetage:any) => {
      this.uploadPercent = percetage
    })

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success("Image Upload Success")
        })
      })
    ).subscribe()

  }



}
