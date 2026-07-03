# Local development

Run strands-compose-chat on your machine without Docker. Uses a local SQLite
database, so it is the fastest way to try the app or develop against it.

## Prerequisites

- Python 3.11 or newer
- Either [uv](https://docs.astral.sh/uv/) (recommended) or `pip`

## Steps

1. **Configure environment.** Copy the template and set the required values:

   ```bash
   cp example.env .env
   ```

   Open `.env` and set `SESSION_SECRET_KEY` (the file shows the command to
   generate one) and `ADMIN_BOOTSTRAP_PASSWORD`.

2. **Install.**

   With uv:

   ```bash
   uv sync
   ```

   Or with pip:

   ```bash
   python -m venv .venv
   source .venv/bin/activate      # Windows: .venv\Scripts\activate
   pip install "strands-compose-chat==0.1.5"
   ```

   With the pip path, keep this virtual environment activated for the remaining
   steps (re-run the `activate` command if you open a new terminal), otherwise
   the `strands-compose-chat` command will not be found.

3. **Create the database.**

   ```bash
   uv run strands-compose-chat migrate     # with pip: strands-compose-chat migrate
   ```

4. **Start the server.**

   ```bash
   uv run strands-compose-chat serve        # with pip: strands-compose-chat serve
   ```

5. **Open the app** at http://127.0.0.1:8000 and sign in with the admin
   account from your `.env`. The admin panel is at http://127.0.0.1:8000/admin,
   where you add the agents users can chat with.

The `.env` file and the `strands-chat.sqlite` database are created in this
directory. Delete the database file to start over.

## Next steps

To run against Postgres or deploy with containers, see
[`../02-docker`](../02-docker). For configuration options and usage, see the
project documentation.
