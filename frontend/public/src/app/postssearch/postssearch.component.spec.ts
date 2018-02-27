import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostssearchComponent } from './postssearch.component';

describe('PostssearchComponent', () => {
  let component: PostssearchComponent;
  let fixture: ComponentFixture<PostssearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostssearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostssearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
