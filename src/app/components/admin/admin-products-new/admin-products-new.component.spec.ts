import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsNewComponent } from './admin-products-new.component';

describe('AdminProductsNewComponent', () => {
  let component: AdminProductsNewComponent;
  let fixture: ComponentFixture<AdminProductsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
