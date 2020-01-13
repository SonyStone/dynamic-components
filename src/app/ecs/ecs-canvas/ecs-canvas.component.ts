import { ChangeDetectionStrategy, Component, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { World } from '@ecs';

import { Acceleration, CanvasContext, Circle, PerformanceСompensation, DemoSettings, Intersecting, Position, Velocity } from './components';
import { IntersectionSystem, MovementSystem, Renderer } from './systems';
import { random } from './utils';

@Component({
  templateUrl: 'ecs-canvas.component.html',
  styleUrls: ['ecs-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcsCanvasComponent {
  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
    private zone: NgZone,
  ) {
    this.zone.runOutsideAngular(() => {
    const world = new World();

    world
      .registerComponent(Circle)
      .registerComponent(Velocity)
      .registerComponent(Acceleration)
      .registerComponent(Position)
      .registerComponent(Intersecting)
      .registerSystem(MovementSystem)
      .registerSystem(Renderer)
      .registerSystem(IntersectionSystem);

    // Used for singleton components
    const singletonEntity = world.createEntity()
        .addComponent(PerformanceСompensation)
        .addComponent(CanvasContext)
        .addComponent(DemoSettings);

    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.renderer.appendChild(this.elementRef.nativeElement, canvas);

    const canvasComponent = singletonEntity.getMutableComponent(CanvasContext);
    canvasComponent.ctx = canvas.getContext('2d');
    canvasComponent.width = canvas.width;
    canvasComponent.height = canvas.height;

    for (let i = 0; i < 100; i++) {
      const entity = world.createEntity()
        .addComponent(Circle)
        .addComponent(Velocity)
        .addComponent(Acceleration)
        .addComponent(Position);

      const circle = entity.getMutableComponent(Circle);
      const position = entity.getMutableComponent(Position);

      position.set(
        random(0, canvas.width),
        random(0, canvas.height),
      );
      circle.radius = random(20, 100);

      const velocity = entity.getMutableComponent(Velocity);
      velocity.set(random(-20, 20), random(-20, 20));
    }

    // window.addEventListener( 'resize', () => {
    //   canvasComponent.width = canvas.width = window.innerWidth;
    //   canvasComponent.height = canvas.height = window.innerHeight;
    // }, false );

    const performanceСompensation = singletonEntity.getMutableComponent(PerformanceСompensation);

    let lastTime = performance.now();
    function update() {

      const time = performance.now();
      performanceСompensation.delta = time - lastTime;
      lastTime = time;

      world.run();

      requestAnimationFrame(update);
    }

    update();
  });
  }
}
