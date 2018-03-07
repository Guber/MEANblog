import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriesService} from '../categories.service';
import {Category} from '../category';
import {Post} from '../../post/post';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  category_id: Number;
  task: String;
  category: Category;
  file: File;
  categoryImgUrl: String;
  private mainImgBase64: string;
  private defaultCategoryImgUrl: String = '/assets/img/image.png';
  private dataUrl = environment.dataUrl;

  constructor(private categoriesService: CategoriesService, private route: ActivatedRoute, private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.task = params['task'];
      if (this.task === 'edit') {
        this.category_id = +params['id'];
        this.fetchPostData(this.category_id);
      } else {
        this.category = new Category();
      }
    });
  }

  fetchPostData(category_id) {
    this.categoriesService.getCategory(category_id).subscribe(category => {
      this.category = category;
      this.categoryImgUrl = this.dataUrl + '/img/categories/' + category._id + '/' + category.mainImg;
    });
  }

  onImageInputChange(event: any) {
    const files: FileList = event.target.files;
    this.file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const target: any = e.target;
      this.categoryImgUrl = target.result;
      this.mainImgBase64 = target.result;
    };
    reader.readAsDataURL(this.file);
  }

  setMainImgToDefault() {
    this.categoryImgUrl = this.defaultCategoryImgUrl;
  }

  saveCategory() {
    this.category['mainImgBase64'] = this.mainImgBase64;

    if (this.task === 'edit') {
      this.categoriesService.postExisting(this.category._id, this.category).subscribe(res => {
        this.snackBar.open('Successfully saved the category.', '', {duration: 2000,});
        this.fetchPostData(this.category_id);
      }, error => this.snackBar.open(error, '', {duration: 2000,}));
    } else {
      if (this.task === 'copy') {
        this.category_id = undefined;
      }

      this.categoriesService.postNew(this.category).subscribe(res => {
        this.category_id = res._id;
        this.snackBar.open('Successfully added the category.', '', {duration: 2000,});
        this.router.navigate(['categories/edit/' + this.category_id]);
      }, error => this.snackBar.open(error, '', {duration: 2000,}));
    }
  }

}
