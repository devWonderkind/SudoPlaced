# Sudo Placed Backend

## Running Dev Server
`bash
uv run python manage.py runserver
`

## Project Setup
Make sure uv is installed (pip install uv)

`bash
cd backend
`

This creates the .venv and installs everything from your lockfile
`bash
uv sync
`

`bash
uv run python manage.py migrate
`


