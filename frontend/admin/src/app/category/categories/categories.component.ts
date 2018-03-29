import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../category';
import { Post } from '../../post/post';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {

  posts: Post[] = [];
  categories: Category[];
  defaultCategoryImgUrl = 'assets/img/image.png';
  private dataUrl = environment.dataUrl;

  constructor(private categoriesService: CategoriesService, private route: ActivatedRoute) {  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoriesService.getCategoryPosts(+params['id']).subscribe(posts => {
        this.posts = posts;
      });
      this.categoriesService.getAllCategories().subscribe(categories => {
        this.categories = categories;

        this.categories.forEach((category) => {
          category.mainImg = this.dataUrl + '/img/categories/' + category._id + '/' + category.mainImg;
        });
      });
    });
  }

  setCategoryImgToDefault(category) {
    category.mainImg = this.defaultCategoryImgUrl;
  }

  deleteCategory(categoryId) {
    if (confirm('You sure you want to delete this category?')) {
      this.categoriesService.deleteCategory(categoryId).subscribe(complete => {
        this.fetchData();
      });
    }
  }

  fetchData() {
    this.categoriesService.getAllCategories().subscribe(categories => {
      this.categories = categories;

      this.categories.forEach((category) => {
        category.mainImg = this.dataUrl + '/img/categories/' + category._id + '/' + category.mainImg;
      });
    });
  }
}
