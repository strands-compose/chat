# run test tasks
[group('test')]
test: test-fast

# run the Fast tier: unit + SQLite-backed service/route/contract/streaming tests
# excludes @postgres-marked dialect-sensitive tests
[group('test')]
test-fast cov_fail_under="65":
    uv run pytest \
        -m "not postgres" \
        --cov={{SOURCES}} \
        --cov-fail-under={{cov_fail_under}} \
        {{TESTS}}

# run the Postgres tier: dialect-sensitive tests + migration guard
# requires DATABASE_URL pointing at a live PostgreSQL instance
# whitelists the database host for socket access
[group('test')]
test-postgres db_host="localhost":
    uv run pytest \
        -m postgres \
        --allow-hosts={{db_host}} \
        --cov={{SOURCES}} \
        {{TESTS}}

# regenerate the OpenAPI snapshot after an intended API change
[group('test')]
update-snapshot $UPDATE_SNAPSHOT="1":
    uv run pytest tests/contract/test_openapi_snapshot.py

# (legacy) run all tests with coverage — kept for local ad-hoc use
[group('test')]
test-coverage cov_fail_under="90":
    uv run python -m pytest --cov={{SOURCES}} --cov-fail-under={{cov_fail_under}} {{TESTS}}
