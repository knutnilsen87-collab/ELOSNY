# Worker / Job State Machine Spec

Use only if the project has async jobs, queues, background tasks, or processing pipelines.

## Standard states
- queued
- running
- retry_scheduled
- succeeded
- failed
- blocked
- cancelled

## Transition rules
Document what can move where, and under what conditions.
