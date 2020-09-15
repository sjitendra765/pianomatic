import {
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ReflectiveInjector,
    EventEmitter
  } from '@angular/core'
  import { Observable, Subscription, from } from 'rxjs';
  import { KeyDialogueComponent } from '../components/key-dialogue/key-dialogue.component'
  @Injectable()
  export class Service {
    factoryResolver: any
    rootViewContainer: any
    currentComponent :any
    private reader: Observable<any>;
    index: EventEmitter<number> = new EventEmitter();

    constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
      this.factoryResolver = factoryResolver
    }
    setRootViewContainerRef(viewContainerRef) {
      this.rootViewContainer = viewContainerRef
    }
    addDynamicComponent(keyData) {
      const factory = this.factoryResolver
                          .resolveComponentFactory(KeyDialogueComponent)
      const component = factory
        .create(this.rootViewContainer.parentInjector)
      this.rootViewContainer.insert(component.hostView)
      component.instance.keyData = keyData
      this.currentComponent = component.instance
      return Observable.create(observer => {
        this.reader = component.instance.newKeyData
        this.reader.subscribe(data => {
          observer.next(data);
        });
      })
    }
    updateComponent(idx){
      this.index.emit(idx)
      //this.rootViewContainer.instance.frequency = `223`;
    }
    getIndexEmitter() {
      return this.index;
    }
    removeComponent(idx){
      this.rootViewContainer.remove(idx)
    }
  }