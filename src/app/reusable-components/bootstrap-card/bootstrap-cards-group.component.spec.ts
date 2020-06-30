import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapCardGroupComponent } from './bootstrap-cards-group.component';

describe('BootstrapCardGroupComponent', () => {
  let component: BootstrapCardGroupComponent;
  let fixture: ComponentFixture<BootstrapCardGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootstrapCardGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
