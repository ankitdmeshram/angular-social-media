import { Component, Input, OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare
} from '@fortawesome/free-regular-svg-icons'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  @Input() post:any;

  uid = null;

  upvote:number = 0;
  downvote:number = 0;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase
  ) {
    auth.getUser().subscribe((user:any)=> {
      this.uid = user?.uid;
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if(this.post.vote)
    {
      Object.values(this.post.vote).map((val:any) => {
        if(val.upvote) {
          this.upvote += 1;
        }
        if(val.downvote) {
          this.downvote += 1;
        }
      })
    }
  }

  // TODO: bug in updating the changes

  upvotePost() {
    console.log("UPVOTING")
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote: 1,
    })
  }

  downvotePost() {
    console.log("DOWNVOTING")
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote: 1,
    })
  }

  getInstaUrl() {
    return `https://instagram.com/${this.post.instaId}`
  }

}
