
## Vitest is faster than jest and for vite project vitest is recommended to use
### Setup:

### Install Vitest + ecosystem

          npm install -D vitest @vitest/ui @vitest/coverage-v8
          npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event


```
this is codee block
```

# Testing Universe

There are only three types of tests in frontend engineering:

1- Unit Tests

2- Integration Tests

3- E2E (End-to-End) Tests

## Unit Testing — smallest, sharpest microscope

Definition:
A unit test checks one tiny piece of your app in isolation, without touching anything external.

Goal:
Verify one function, one hook, one small component behaves correctly.

Mental rule:
If you need backend, router, big UI — it's NOT unit testing.

Why unit test?
Because bugs in small logic cause big failures.
Unit tests act like your app’s immune system.

## Integration Testing — orchestra test

Definition:
Test how different parts of the app work together:
Component + API mock + router + context + redux.
You are still inside the browser, but using mocks for everything external.

Goal:
Simulate how a real user interacts.

### LoginPage integration test:

    type email
    click Login
    send axios request (mocked)
    show success message
    store token
    navigate based on role
    show error on failure
    This involves:
    React components
    axios
    react-router
    state
    
This is integration, not unit.

Why integration tests?

Because they catch “real app” bugs that unit tests cannot find.

## E2E Testing — the entire system
**This is the big boss.**

*Definition:
Run your app in a real browser using Playwright/Cypress,
call your real backed (or a staging backend),
and simulate a full user journey.*

In your turf app, E2E tests include:

- Login → navigate → book turf → payment

- Map loading → selecting location → searching turfs

- Admin creating turf → seeing it appear in dashboard
Why E2E?

Because even integration tests can’t catch:

        Broken build
        Routing misconfigurations
        Network failures
        CSS/UI regressions
        Mobile viewport issues
        Mapbox/Leaflet loading issues

*But they are slow and flaky.
So big apps keep them small and focused.*


## Big apps follow this pyramid:

      E2E (few)
      Integration (medium)
      Unit Tests (many)



# Unit test Implementation

Unit testing React usually needs:

render() → to place the component onto a fake DOM

screen → to find UI elements

userEvent → to simulate typing & clicking

A wrapper for Router because your LoginPage uses useNavigate()