# Repo Structure and Conventions

## Recommended top-level structure
- /apps
- /services
- /packages or /libs
- /infra
- /docs
- /scripts
- /tests

## Naming conventions
- Use one style consistently
- Document service names, package names, environment names, and branch conventions

## Required operational artifact

`status_bundle` files belong with run/task artifacts or in the owning docs/artifacts location. Do not scatter competing status formats across the repository. Keep one latest bundle and versioned snapshots when needed.
