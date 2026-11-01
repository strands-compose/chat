# build the frontend and place artifacts into the Python package static directory
[group('ui')]
build-ui:
    npm --prefix ui ci
    npm --prefix ui run build:backend

# check frontend format, imports and lint (Biome)
[group('ui')]
check-ui:
    npm --prefix ui run lint

# format frontend code, sort imports and apply safe lint fixes (Biome)
[group('ui')]
format-ui:
    npm --prefix ui run format
