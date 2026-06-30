# build the frontend and place artifacts into the Python package static directory
[group('ui')]
build-ui:
    cd ui && npm ci && npm run build:backend
