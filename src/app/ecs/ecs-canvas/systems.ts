import { SystemBase } from '@ecs';

import { Acceleration, CanvasContext, Circle, DemoSettings, Intersecting, Position, Velocity, PerformanceСompensation } from './components';
import { drawLine, fillCircle, intersection } from './utils';

export class MovementSystem extends SystemBase {

  static queries = {
    entities: { components: [Circle, Velocity, Acceleration, Position] },
    context: { components: [PerformanceСompensation, CanvasContext, DemoSettings], mandatory: true }
  };

  run() {
    const context = this.queries.context.results[0];
    const canvasContext = context.getComponent(CanvasContext);
    const canvasWidth = canvasContext.width;
    const canvasHeight = canvasContext.height;
    const delta = context.getComponent(PerformanceСompensation).delta;
    const multiplier = context.getComponent(DemoSettings).speedMultiplier;

    const entities = this.queries.entities.results;

    for (const entity of entities) {
      const circle = entity.getMutableComponent(Circle);
      const velocity = entity.getMutableComponent(Velocity);
      const acceleration = entity.getMutableComponent(Acceleration);
      const position = entity.getMutableComponent(Position);

      position.x +=
        velocity.x * acceleration.x * delta * multiplier;
      position.y +=
        velocity.y * acceleration.y * delta * multiplier;

      if (acceleration.x > 1) {
        acceleration.x -= delta * multiplier;
      }
      if (acceleration.y > 1) {
        acceleration.y -= delta * multiplier;
      }
      if (acceleration.x < 1) { acceleration.x = 1; }
      if (acceleration.y < 1) { acceleration.y = 1; }

      if (position.y + circle.radius < 0) {
        position.y = canvasHeight + circle.radius;
      }

      if (position.y - circle.radius > canvasHeight) {
        position.y = -circle.radius;
      }

      if (position.x - circle.radius > canvasWidth) {
        position.x = 0;
      }

      if (position.x + circle.radius < 0) {
        position.x = canvasWidth;
      }
    }
  }
}

export class IntersectionSystem extends SystemBase {

  static queries = {
    entities: { components: [Circle, Position] }
  };

  run() {
    const entities = this.queries.entities.results;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (entity.hasComponent(Intersecting)) {
        entity.getMutableComponent(Intersecting).points.length = 0;
      }

      const circle = entity.getComponent(Circle);
      const position = entity.getMutableComponent(Position);

      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j];
        const circleB = entityB.getComponent(Circle);
        const positionB = entityB.getMutableComponent(Position);

        const intersect = intersection(circle, position, circleB, positionB);

        if (intersect !== false) {
          let intersectComponent;
          if (!entity.hasComponent(Intersecting)) {
            entity.addComponent(Intersecting);
          }
          intersectComponent = entity.getMutableComponent(Intersecting);
          intersectComponent.points.push(intersect);
        }
      }
      if (
        entity.hasComponent(Intersecting) &&
        entity.getComponent(Intersecting).points.length === 0
      ) {
        entity.removeComponent(Intersecting);
      }
    }
  }

  stop() {
    super.stop();
    // Clean up interesection when stopping
    const entities = this.queries.entities;

    for (const entity of entities) {
      if (entity.hasComponent(Intersecting)) {
        entity.getMutableComponent(Intersecting).points.length = 0;
      }
    }
  }
}

export class Renderer extends SystemBase {

  static queries = {
    circles: { components: [Circle, Position] },
    intersectingCircles: { components: [Intersecting] },
    context: { components: [CanvasContext], mandatory: true }
  };

  run() {
    const context = this.queries.context.results[0];
    const canvasComponent = context.getComponent(CanvasContext);
    const ctx = canvasComponent.ctx;
    const canvasWidth = canvasComponent.width;
    const canvasHeight = canvasComponent.height;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const circles = this.queries.circles.results;

    for (const circle of circles) {
      const component = circle.getComponent(Circle);
      const position = circle.getMutableComponent(Position);

      ctx.beginPath();
      ctx.arc(
        position.x,
        position.y,
        component.radius,
        0,
        2 * Math.PI,
        false
      );
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }

    const intersectingCircles = this.queries.intersectingCircles.results;

    for (const intersectingCircle of intersectingCircles) {
      const intersect = intersectingCircle.getComponent(Intersecting);

      for (const points of intersect.points) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff9';

        ctx.fillStyle = 'rgba(255, 255,255, 0.2)';
        fillCircle(ctx, points[0], points[1], 8);
        fillCircle(ctx, points[2], points[3], 8);

        ctx.fillStyle = '#fff';
        fillCircle(ctx, points[0], points[1], 3);
        fillCircle(ctx, points[2], points[3], 3);

        drawLine(ctx, points[0], points[1], points[2], points[3]);
      }
    }
  }
}
