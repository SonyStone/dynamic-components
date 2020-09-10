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


export { resolveDynamicModule, NgModulePortal, TemplatePortal, ComponentPortal } from './lib/portals/ng-module';

export { DynamicModule } from './lib/dynamic.module';
