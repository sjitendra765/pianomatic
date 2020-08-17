import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TemperamentComponent } from './temperament.component';

describe('TemperamentComponent', () => {
  let component: TemperamentComponent;
  let fixture: ComponentFixture<TemperamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperamentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TemperamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
