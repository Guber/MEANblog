import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  categories: any = [];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.categoriesService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
