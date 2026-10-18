#pragma once

#include "AsyncResult.h"
#include "Future.h"
#include "Optimization/AtomicSharedPtr.h"

namespace uniuno {

/**
 * @brief Deferred is a Standalone Promise object.
 * It allows creating a Future that can be resolved or rejected manually
 * from outside (e.g. from an ISR, Timer, or another thread).
 * 
 * @tparam I The input type of the future.
 * @tparam O The output type of the future.
 * @tparam E The error type of the future.
 */
template <typename I, typename O, typename E = Error>
class Deferred {
public:
    Deferred() : state(AtomicSharedPtr<AsyncResult<O, E>>(AsyncResult<O, E>::pending())) {}

    /** @brief Resolves the deferred with the given output. */
    void resolve(O output) {
        if (state && state->is_pending()) {
            *state = AsyncResult<O, E>::resolve(std::move(output));
        }
    }

    /** @brief Rejects the deferred with the given error. */
    void reject(E error) {
        if (state && state->is_pending()) {
            *state = AsyncResult<O, E>::reject(std::move(error));
        }
    }

    /** @brief Gets a Future linked to this Deferred object. */
    Future<I, O, E> get_future() const {
        return Future<I, O, E>([state = this->state](I) mutable -> AsyncResult<O, E> {
            return *state;
        });
    }

private:
    AtomicSharedPtr<AsyncResult<O, E>> state;
};

/**
 * @brief Deferred specialization for void input.
 */
template <typename O, typename E>
class Deferred<void, O, E> {
public:
    Deferred() : state(AtomicSharedPtr<AsyncResult<O, E>>(AsyncResult<O, E>::pending())) {}

    void resolve(O output) {
        if (state && state->is_pending()) {
            *state = AsyncResult<O, E>::resolve(std::move(output));
        }
    }

    void reject(E error) {
        if (state && state->is_pending()) {
            *state = AsyncResult<O, E>::reject(std::move(error));
        }
    }

    Future<void, O, E> get_future() const {
        return Future<void, O, E>([state = this->state]() mutable -> AsyncResult<O, E> {
            return *state;
        });
    }

private:
    AtomicSharedPtr<AsyncResult<O, E>> state;
};

/**
 * @brief Deferred specialization for void input and output.
 */
template <typename E>
class Deferred<void, void, E> {
public:
    Deferred() : state(AtomicSharedPtr<AsyncResult<void, E>>(AsyncResult<void, E>::pending())) {}

    void resolve() {
        if (state && state->is_pending()) {
            *state = AsyncResult<void, E>::resolve();
        }
    }

    void reject(E error) {
        if (state && state->is_pending()) {
            *state = AsyncResult<void, E>::reject(std::move(error));
        }
    }

    Future<void, void, E> get_future() const {
        return Future<void, void, E>([state = this->state]() mutable -> AsyncResult<void, E> {
            return *state;
        });
    }

private:
    AtomicSharedPtr<AsyncResult<void, E>> state;
};

} // namespace uniuno
