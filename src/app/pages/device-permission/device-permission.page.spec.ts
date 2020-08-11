import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DevicePermissionPage } from './device-permission.page';

describe('DevicePermissionPage', () => {
  let component: DevicePermissionPage;
  let fixture: ComponentFixture<DevicePermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePermissionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DevicePermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
