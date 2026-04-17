---
name: test
description: Validate changes with the smallest effective checks first.
---

# Test skill

## Procedure
1. Identify changed files
2. Run targeted tests first
3. Run lint/typecheck for touched scope
4. Run broader tests only if needed
5. Report exactly what ran and the result
