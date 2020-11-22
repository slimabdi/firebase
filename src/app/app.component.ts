import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

 // title = 'chatFirebase';
 ngOnInit(): void {
  const observable: Observable<number> = of(1, 2, 3);
  observable.subscribe(res => console.log(res));
  }
}
