/**
 * Monadic Result<S, F> Implementation
 * Eliminates unhandled runtime exceptions by wrapping computations in sealed functional containers.
 */

export type ResultMatch<S, F, R> = {
  success: (value: S) => R;
  failure: (error: F) => R;
};

export class Result<S, F> {
  private constructor(
    private readonly value: S | null,
    private readonly error: F | null,
    private readonly successFlag: boolean
  ) {}

  static success<S, F = never>(value: S): Result<S, F> {
    return new Result<S, F>(value, null, true);
  }

  static failure<S = never, F = Error>(error: F): Result<S, F> {
    return new Result<S, F>(null, error, false);
  }

  static fromThrowable<T, E = Error>(fn: () => T, errorMapper?: (e: unknown) => E): Result<T, E> {
    try {
      return Result.success(fn());
    } catch (e) {
      const err = errorMapper ? errorMapper(e) : (e as E);
      return Result.failure(err);
    }
  }

  static async fromAsyncThrowable<T, E = Error>(
    fn: () => Promise<T>,
    errorMapper?: (e: unknown) => E
  ): Promise<Result<T, E>> {
    try {
      const res = await fn();
      return Result.success(res);
    } catch (e) {
      const err = errorMapper ? errorMapper(e) : (e as E);
      return Result.failure(err);
    }
  }

  isSuccess(): boolean {
    return this.successFlag;
  }

  isFailure(): boolean {
    return !this.successFlag;
  }

  getValue(): S {
    if (!this.successFlag) {
      throw new Error('Attempted to call getValue() on a Failure Result.');
    }
    return this.value as S;
  }

  getError(): F {
    if (this.successFlag) {
      throw new Error('Attempted to call getError() on a Success Result.');
    }
    return this.error as F;
  }

  map<R>(fn: (val: S) => R): Result<R, F> {
    if (this.successFlag) {
      return Result.success(fn(this.value as S));
    }
    return Result.failure(this.error as F);
  }

  flatMap<R>(fn: (val: S) => Result<R, F>): Result<R, F> {
    if (this.successFlag) {
      return fn(this.value as S);
    }
    return Result.failure(this.error as F);
  }

  match<R>(m: ResultMatch<S, F, R>): R {
    if (this.successFlag) {
      return m.success(this.value as S);
    }
    return m.failure(this.error as F);
  }

  unwrapOr(fallback: S): S {
    return this.successFlag ? (this.value as S) : fallback;
  }
}
