import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../category';
import { Post } from '../post';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {

  posts: Post[] = [];
  category: Category;

  constructor(private categoriesService: CategoriesService, private route: ActivatedRoute) {  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoriesService.getCategoryPosts(+params['id']).subscribe(posts => {
        this.posts = posts;
      });
      this.categoriesService.getCategory(+params['id']).subscribe(category => {
        this.category = category;
      });
    });
  }

}
