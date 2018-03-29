import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {PostsService} from '../posts.service';
import {UsersService} from '../../user/users.service';
import {CategoriesService} from '../../category/categories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../post';
import {User} from '../../user/user';
import {Category} from '../../category/category';
import {environment} from '../../../environments/environment';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

declare let window: any;
let self: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postUrl = environment.apiUrl + 'posts/';
  dataUrl = environment.dataUrl;
  categoryControl: FormControl = new FormControl();
  file: File;
  post: Post;
  post_id: Number;
  task: String;
  author: User;
  category: Category;
  categories: Category[];
  tags: any = [];
  oldImages: any = [];
  newImages: any = [];
  tagInput = '';
  private postImgUrl: String;
  private mainImgBase64: string;
  private defaultPostImgUrl: String = 'assets/img/image.png';
  private fetchLock = false;

  constructor(private postsService: PostsService, private usersService: UsersService, private categoryService: CategoriesService,
              private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    self = this;
    this.post = new Post();
    this.route.params.subscribe(params => {
      this.post_id = +params['id'];
      this.task = params['task'];

      if (this.post_id !== undefined) {
        this.fetchPostData(+params['id']);
      }
    });

    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  ngAfterViewInit() {
    setTimeout(function () {
      window.tinymce.init({
        selector: '#article_content',
        height: 200,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor textcolor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table contextmenu paste code'
        ],
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | paste',
        content_css: '//www.tinymce.com/css/codepen.min.css',
        menubar: 'edit',
        paste_data_images: true,
        images_upload_url: 'postAcceptor.php',
        images_upload_base_path: '/some/basepath',
        images_upload_credentials: true
      });

    }, 1000);
  }

  ngOnDestroy() {
    window.tinymce.remove();
  }

  addTag() {
    const tag = {value: this.tagInput, remove: false};
    this.tagInput = '';
    this.tags.push(tag);
  }

  savePost(showSamePost) {
    this.post.body = window.tinyMCE.activeEditor.getContent({format: 'raw'});
    this.post.tags = [];
    this.post.images = [];

    this.tags.forEach((tag) => {
      if (tag.value && !tag.remove) {
        this.post.tags.push(tag.value);
      }
    });

    this.post['mainImgBase64'] = this.mainImgBase64;

    if (this.task === 'edit') {
      this.postsService.postExisting(this.post._id, this.post).subscribe(res => {
        this.saveImages();
        this.snackBar.open('Successfully saved the post.', '', {duration: 2000, });
        this.fetchPostData(this.post_id);
      }, error => this.snackBar.open(error, '', {duration: 2000, }));
    } else {
      if (this.task === 'copy') {
        this.post._id = undefined;
      }

      this.postsService.postNew(this.post).subscribe(res => {
        this.post_id = res._id;
        this.saveImages();
        this.snackBar.open('Successfully added the post.', '', {duration: 2000, });
        this.router.navigate(['post/edit/' + this.post_id]);
      }, error => this.snackBar.open(error, '', {duration: 2000, }));
    }

  }

  saveImages() {
    this.newImages.forEach((img) => {
      if (img.addFlag) {
        const data = {};
        data['imgDataBase64'] = img.value;
        self.postsService.postPostImage(self.post_id, data).subscribe(posts => {
          this.fetchPostData(this.post_id);
        }, error => alert(error));
      }
    });

    this.oldImages.forEach((img) => {
      if (!img.addFlag) {
        self.postsService.deletePostImage(self.post_id, img.value).subscribe(posts => {
          this.fetchPostData(this.post_id);
        }, error => alert(error));
      }
    });

    this.newImages = [];
  }

  fetchPostData(post_id) {
    this.postsService.getPost(post_id).subscribe(post => {
      this.post = post;
      this.postImgUrl = this.dataUrl + '/img/posts/' + post._id + '/' + post.mainImg;
      this.postUrl = environment.apiUrl + 'posts/' + post._id;
      this.tags = [];
      post.tags.forEach((el) => {
        const tag = {value: el, remove: false};
        this.tags.push(tag);
      });

      this.oldImages = [];

      let _oldImages = [];
      post.images.forEach((el) => {
        const image = {value: el, addFlag: true};
        _oldImages.push(image);
      });

      this.oldImages = _oldImages;

      this.usersService.getUser(self.post.author_id).subscribe(user => {
        this.author = user;
      });

      this.categoryService.getCategory(self.post.category_id).subscribe(category => {
        this.category = category;
      });
    });
  }

  onImageInputChange(event: any, mainImg) {
    const files: FileList = event.target.files;
    this.file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const target: any = e.target;
      if (mainImg) {
        this.postImgUrl = target.result;
        this.mainImgBase64 = target.result;
      } else {
        this.newImages.push({value: reader.result, addFlag: true});
      }
    };
    reader.readAsDataURL(this.file);
  }

  setMainImgToDefault() {
    this.postImgUrl = this.defaultPostImgUrl;
  }
}
