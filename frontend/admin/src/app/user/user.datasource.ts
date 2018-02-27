import {User} from './user';
import {MatPaginator, MatSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {UsersService} from './users.service';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class UserDataSource extends DataSource<User> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }


  constructor(private usersService: UsersService, private _sort: MatSort, private _paginator: MatPaginator) {
    super();

    this._paginator.pageSize = 10;
    this._paginator.pageIndex = 0;

    this.fetchData();

    this._sort.sortChange.subscribe(() => {
      this.fetchData();
    });

    this._paginator.page.subscribe(() => {
      this.fetchData();
    });

  }

  data = new BehaviorSubject<User[]>([]);

  connect(): Observable<User[]> {
    return this.data.asObservable();
  }

  disconnect() {
  }

  fetchData() {
    const offset = this._paginator.pageIndex * this._paginator.pageSize;
    this.usersService.getAllUsers(this._paginator.pageSize, offset, this._sort.active, this._sort.direction, this.filter.toLowerCase()).subscribe(users => {
      this.data.next(users);
    });
  }

  deleteUser(userId) {
    this.usersService.deleteUser(userId).subscribe(complete => {
      const offset = this._paginator.pageIndex * this._paginator.pageSize;

      this.usersService.getAllUsers(this._paginator.pageSize, offset, this._sort.active, this._sort.direction, this.filter.toLowerCase()).subscribe(users => {
        this.data.next(users);
      });
    });
  }

}
