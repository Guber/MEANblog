import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {MatSort, MatPaginator} from '@angular/material';
import {UsersService} from '../users.service';
import {User} from '../user';
import {UserDataSource} from '../user.datasource';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  users: User[];
  displayedColumns = ['image', 'username', 'id', 'modified',  'actions'];
  dataSource: UserDataSource | null;
  defaultSelfProfileImgUrl = 'assets/img/user.jpg';
  totalUsers: number;

  constructor(private usersService: UsersService, private router: Router) {
  }

  ngOnInit() {
    this.usersService.getUsersCount().subscribe(count => {
      this.totalUsers = count;
    });

    this.dataSource = new UserDataSource(this.usersService, this.sort, this.paginator);
  }

  deleteUser(user) {
    if (confirm('Warning, this action cannot be undone!')) {
      this.dataSource.deleteUser(user._id);
    }
  }

  setUserImgToDefault(user) {
    user.profileImg = this.defaultSelfProfileImgUrl;
  }
}
