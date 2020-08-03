import {
  ObjectUnsubscribedError,
  Observable,
  Observer,
  OperatorFunction,
  Subscriber,
  Subscription,
  SubscriptionLike,
  of,
  Subject,
} from 'rxjs';
import { tap } from 'rxjs/operators';

export class StoreSubject<T> extends Subject<T> {

  source = of(this.value);

  constructor(
    protected value?: T,
  ) {
    super();
  }

  action(operator: OperatorFunction<T, T>) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }

    operator(this.source)
      .pipe(
        // tap((v) => console.log(`log-name`, v)),
      )
      .subscribe((value) => {
        this.next(this.value = value);
      })
  }
}

export class Store<T> extends Observable<T> implements SubscriptionLike {
  observers: Observer<T>[] | null = [];

  source = of(this.value);

  closed = false;

  isStopped = false;

  hasError = false;

  thrownError: any = null;

  constructor(
    protected value?: T,
  ) {
    super();
  }

  action(operator: OperatorFunction<T, T>) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }

     console.log(`Store`, this);

    operator(this.source)
      .pipe(
        tap((v) => console.log(`log-name`, v)),
      )
      .subscribe((value) => {
        this.next(value);
      })

    // of(this.value).pipe(operator)
    //   .pipe(
    //     tap((v) => console.log(`log-name`, v)),
    //   )
    //   .subscribe((value) => {
    //     this.next(value);
    //   })
  }

  next(value: T): void {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }

    if (!this.isStopped) {
      const { observers } = this;

      const len = observers.length;
      const copy = observers.slice();

      for (let i = 0; i < len; i++) {
        copy[i].next(this.value = value);
      }
    }
  }

  unsubscribe(): void {
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  }

  _subscribe(subscriber: Subscriber<T>): Subscription {
    if (this.closed) {
      throw new ObjectUnsubscribedError();

    } else if (this.hasError) {
      subscriber.error(this.thrownError);
      return Subscription.EMPTY;

    } else if (this.isStopped) {
      subscriber.complete();
      return Subscription.EMPTY;

    } else {
      console.log(`this.observers.push`, subscriber);

      this.observers.push(subscriber);
      return new SubjectSubscription(this, subscriber);
    }
  }

  /**
   * Creates a new Observable with this Store as the source. You can do this
   * to create customize Observer-side logic of the Subject and conceal it from
   * code that uses the Observable.
   */
  asObservable(): Observable<T> {
    const observable = new Observable<T>();
    observable.source = this;

    return observable;
  }
}


export class SubjectSubscription<T> extends Subscription {
  closed = false;

  constructor(
    public subject: Store<T>,
    public subscriber: Observer<T>
  ) {
    super();
  }

  unsubscribe() {
    if (this.closed) {
      return;
    }

    this.closed = true;

    const subject = this.subject;
    const observers = subject.observers;

    this.subject = null;

    if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
      return;
    }

    const subscriberIndex = observers.indexOf(this.subscriber);

    if (subscriberIndex !== -1) {
      observers.splice(subscriberIndex, 1);
    }
  }
}
