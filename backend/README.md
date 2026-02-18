# Sudo Placed Backend

## Running Dev Server
`
uv run python manage.py runserver
`

## Project Setup
Make sure uv is installed (pip install uv)

`
cd backend
`

This creates the .venv and installs everything from your lockfile
`
uv sync
`

`
uv run python manage.py migrate
`
