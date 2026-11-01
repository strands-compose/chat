# Project Tasks

This directory contains Just tasks for automating common project operations. Each task file is focused on a specific aspect of the project.

## Task Groups

### Clean Tasks (`clean.just`)
Tasks for cleaning project files and caches:

- `clean`: Run all clean tasks
  ```bash
  uv run just clean
  ```

- `clean-python`: Clean Python cache files (in src, tests, notebooks)
  ```bash
  uv run just clean-python
  ```

- `clean-cache`: Clean .cache directory
  ```bash
  uv run just clean-cache
  ```

- `clean-ty`: Clean ty cache
  ```bash
  uv run just clean-ty
  ```

- `clean-pytest`: Clean pytest cache
  ```bash
  uv run just clean-pytest
  ```

- `clean-ruff`: Clean ruff cache
  ```bash
  uv run just clean-ruff
  ```

- `clean-venv`: Clean virtual environment (requires confirmation)
  ```bash
  uv run just clean-venv
  ```

### Check Tasks (`check.just`)
Tasks for running code quality checks:

- `check`: Run all checks (fixes import order and format first)
  ```bash
  uv run just check
  ```

- `check-format`: Fix import order and format, then check the format
  ```bash
  uv run just check-format
  ```

- `check-code`: Run linting checks
  ```bash
  uv run just check-code
  ```

- `check-type`: Run type checking
  ```bash
  uv run just check-type
  ```

- `check-security`: Run the security scan
  ```bash
  uv run just check-security
  ```

- `check-test`: Run tests
  ```bash
  uv run just check-test
  ```

### Verify Tasks (`verify.just`)
The same checks as `check`, but no file is changed. CI runs these:

- `verify`: Run all checks without changing any file
  ```bash
  uv run just verify
  ```

- `verify-format`: Check import order and format without changing any file
  ```bash
  uv run just verify-format
  ```

- `verify-code`: Run linting checks without changing any file
  ```bash
  uv run just verify-code
  ```

### Format Tasks (`format.just`)
Tasks for code formatting:

- `format`: Format all code
  ```bash
  uv run just format
  ```

- `format-import`: Sort imports
  ```bash
  uv run just format-import
  ```

- `format-source`: Format code
  ```bash
  uv run just format-source
  ```

### Install Tasks (`install.just`)
Tasks for managing dependencies:

- `install`: Install all dependencies **and** wire git hooks (run this after every fresh clone)
  ```bash
  uv run just install
  ```

- `install-project`: Install Python dependencies only (no hooks)
  ```bash
  uv run just install-project
  ```

- `install-hooks`: Register pre-commit hooks into `.git/hooks/` (pre-commit, pre-push, commit-msg)
  ```bash
  uv run just install-hooks
  ```

### Commit Tasks (`commit.just`)
Tasks for managing commits:

- **`commit-bump`**: Bump the version of the package using Commitizen.
  ```bash
  uv run just commit-bump
  ```

- **`commit-files`**: Create a conventional commit using Commitizen.
  ```bash
  uv run just commit-files
  ```

- **`commit-info`**: Retrieve commit information using Commitizen.
  ```bash
  uv run just commit-info
  ```

- **`check-hooks`**: Run all pre-commit hooks to ensure code quality.
  ```bash
  uv run just check-hooks
  ```

## Usage

1. Just comes with the dev dependencies (`rust-just`), so `uv run just` needs no extra install. Recipes run in `sh` on Linux and macOS and in PowerShell on Windows, so they avoid syntax that only one of them knows.

2. Run tasks:
   ```bash
   uv run just <task-name>
   ```

3. List all available tasks:
   ```bash
   uv run just --list
   ```

4. Get help for a specific task:
   ```bash
   uv run just --usage <task-name>
   ```

## Task Dependencies

Some tasks depend on others. For example:
- `clean` runs all clean tasks
- `check` runs all check tasks
- `verify` runs `verify-format`, `verify-code`, `check-type` and `check-security`
