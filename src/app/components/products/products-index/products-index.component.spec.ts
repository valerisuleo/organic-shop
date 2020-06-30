import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsIndexComponent } from './products-index.component';

describe('ProductsIndexComponent', () => {
  let component: ProductsIndexComponent;
  let fixture: ComponentFixture<ProductsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
