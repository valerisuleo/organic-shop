import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapListComponent } from './bootstrap-list.component';

describe('BootstrapListComponent', () => {
  let component: BootstrapListComponent;
  let fixture: ComponentFixture<BootstrapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootstrapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
