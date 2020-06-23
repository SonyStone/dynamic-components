import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const raf$ = new Observable<void>(subscriber => {
  const rafId = requestAnimationFrame(() => {
    subscriber.next();
    subscriber.complete();
  });
  return () => cancelAnimationFrame(rafId);
});

/** to ensure an animation frame has passed between */
export const raf = () => switchMap(() => raf$);