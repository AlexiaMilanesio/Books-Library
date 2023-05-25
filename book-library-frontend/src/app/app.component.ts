import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Book Library';
}
