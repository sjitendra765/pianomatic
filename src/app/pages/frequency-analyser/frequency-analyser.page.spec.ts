import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrequencyAnalyserPage } from './frequency-analyser.page';

describe('FrequencyAnalyserPage', () => {
  let component: FrequencyAnalyserPage;
  let fixture: ComponentFixture<FrequencyAnalyserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyAnalyserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrequencyAnalyserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
