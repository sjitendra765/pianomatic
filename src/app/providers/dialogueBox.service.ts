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
    addDynamicComponent(f, name) {
      const factory = this.factoryResolver
                          .resolveComponentFactory(KeyDialogueComponent)
      const component = factory
        .create(this.rootViewContainer.parentInjector)
      this.rootViewContainer.insert(component.hostView)
      component.instance.frequency = f
      component.instance.name = name

    }
    updateComponent(f) {
      console.log("update freq",f)
      //this.rootViewContainer.instance.frequency = `223`;
    }
    removeComponent(idx){
      this.rootViewContainer.remove(idx)
    }
  }