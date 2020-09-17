/*
 * Public API Surface of dynamic
 */

export { DynamicComponentBindings } from './lib/dynamic-component-bindings/dynamic-component-bindings';

export { Context } from './lib/dynamic-component-bindings/context.interface';

export { CompilerService as Compiler } from './lib/compiler.service';



/**
 * utils
 */
export { functionUnpacking } from './lib/untils/function-unpacking';


export { resolveDynamicModule, NgModulePortal } from './lib/portals/ng-module';
export { TemplatePortal } from './lib/portals/template';
export { ComponentPortal } from './lib/portals/component';

export { DynamicModule } from './lib/dynamic.module';
export { provideComponentAccessor } from './lib/portal-content.directive';
