# Provider Probe vs Verify Rule

## Principle
Do not assume an integration works because configuration exists.

- **Probe** = lightweight check that a dependency is reachable
- **Verify** = stronger check that it behaves as required for the current use case

## Rule
Critical paths must have both probe and verify behavior defined.
