import {
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ReflectiveInjector
  } from '@angular/core'
  import { KeyDialogueComponent } from '../components/key-dialogue/key-dialogue.component'
  @Injectable()
  export class Service {
    factoryResolver: any
    rootViewContainer: any
    
    constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
      this.factoryResolver = factoryResolver
    }
    setRootViewContainerRef(viewContainerRef) {
      this.rootViewContainer = viewContainerRef
    }
    addDynamicComponent() {
      const factory = this.factoryResolver
                          .resolveComponentFactory(KeyDialogueComponent)
      const component = factory
        .create(this.rootViewContainer.parentInjector)
      this.rootViewContainer.insert(component.hostView)
    }
    removeComponent(idx){
      this.rootViewContainer.remove(idx)
    }
  }