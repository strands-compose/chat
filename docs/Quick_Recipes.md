# Quick Recipes

Copy-paste starting points. Replace everything in `<angle brackets>`. Every variable is explained in [Chapter 09](Chapter_09.md). The commands run as written in bash, zsh and PowerShell; in Windows PowerShell 5.1, type `curl.exe` instead of `curl`.

## Generate a Secret Key

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Local Development (SQLite)

Save as `.env` in the folder where you run `scc`.

```bash
APP_ENV=dev
SESSION_SECRET_KEY=<output of the command above>
ADMIN_BOOTSTRAP_USERNAME=admin
ADMIN_BOOTSTRAP_PASSWORD=<choose a password>
LOG_LEVEL=DEBUG
```

```bash
scc migrate
scc serve        # http://127.0.0.1:8000
```

## Production on ECS

These are the container's environment. Entries marked **secret** belong in Secrets Manager and go under `secrets` in the task definition ([Chapter 12](Chapter_12.md)).

```bash
APP_ENV=prod
LOG_FORMAT=json
LOG_LEVEL=INFO
TRUSTED_HOSTS=["chat.example.com"]
CORS_ALLOWED_ORIGINS=["https://chat.example.com"]
SESSION_SECRET_KEY=<secret>
DATABASE_URL=<secret: postgresql+psycopg://chat_user:<password>@<rds-endpoint>:5432/chat>
ADMIN_BOOTSTRAP_USERNAME=admin
ADMIN_BOOTSTRAP_PASSWORD=<secret>
WEB_CONCURRENCY=1
GUNICORN_MAX_REQUESTS=20000
GUNICORN_MAX_REQUESTS_JITTER=2000
GUNICORN_KEEPALIVE=65
GUNICORN_GRACEFUL_TIMEOUT=80      # keep below the ECS stopTimeout
```

## Single Sign-On

Add these to either of the blocks above. In every case:

- List the provider id in `OIDC_PROVIDERS`. The id you pick (here `entra`, `okta`, ...) becomes the middle part of the variable names, in upper case.
- Register `https://chat.example.com/auth/callback` as the redirect URI at the identity provider, and set `OIDC_REDIRECT_URI` to the same string.
- Users who sign in for the first time have no group, so they see no agents until an admin adds them to one ([Chapter 07](Chapter_07.md)).

### Microsoft Entra ID

Register an app (Web platform), add a client secret, and note the tenant id.

```bash
OIDC_PROVIDERS=["entra"]
OIDC_REDIRECT_URI=https://chat.example.com/auth/callback
OIDC_ENTRA_DISPLAY_NAME=Microsoft Entra
OIDC_ENTRA_DISCOVERY_URL=https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration
OIDC_ENTRA_CLIENT_ID=<application-client-id>
OIDC_ENTRA_CLIENT_SECRET=<secret>
```

### Okta

Create a Web application (OIDC). The `default` authorization server works for most orgs.

```bash
OIDC_PROVIDERS=["okta"]
OIDC_REDIRECT_URI=https://chat.example.com/auth/callback
OIDC_OKTA_DISPLAY_NAME=Okta
OIDC_OKTA_DISCOVERY_URL=https://<your-org>.okta.com/oauth2/default/.well-known/openid-configuration
OIDC_OKTA_CLIENT_ID=<client-id>
OIDC_OKTA_CLIENT_SECRET=<secret>
```

Use `https://<your-org>.okta.com/.well-known/openid-configuration` for the org authorization server.

### Google

Create an OAuth client of type *Web application* in Google Cloud. Google has no `preferred_username` claim, so name the claim to use or users get their numeric `sub` as username.

```bash
OIDC_PROVIDERS=["google"]
OIDC_REDIRECT_URI=https://chat.example.com/auth/callback
OIDC_GOOGLE_DISPLAY_NAME=Google
OIDC_GOOGLE_DISCOVERY_URL=https://accounts.google.com/.well-known/openid-configuration
OIDC_GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
OIDC_GOOGLE_CLIENT_SECRET=<secret>
OIDC_GOOGLE_USERNAME_CLAIM=email
```

### Amazon Cognito

Create an app client with a client secret, enable the authorization code grant, and allow the `openid`, `email` and `profile` scopes. The pool id looks like `eu-west-1_AbCdEfGhI`.

```bash
OIDC_PROVIDERS=["cognito"]
OIDC_REDIRECT_URI=https://chat.example.com/auth/callback
OIDC_COGNITO_DISPLAY_NAME=Company Login
OIDC_COGNITO_DISCOVERY_URL=https://cognito-idp.<region>.amazonaws.com/<user-pool-id>/.well-known/openid-configuration
OIDC_COGNITO_CLIENT_ID=<app-client-id>
OIDC_COGNITO_CLIENT_SECRET=<secret>
OIDC_COGNITO_USERNAME_CLAIM=email
```

> **Tips & Tricks**
> Several providers at once is fine: `OIDC_PROVIDERS=["entra","okta"]`, then set both groups of variables. To make SSO the only way in, add `AUTH_LOCAL_SIGNIN_ENABLED=false`. That removes password sign-in from the chat. The local admin can still sign in at `/admin/login`, and from there you promote an SSO user to superuser.

## One-Liners

Run the migration as a one-off ECS task. The first command prints the task ARN; put it in place of `<task-arn>` in the other two:

```bash
aws ecs run-task --cluster chat --launch-type FARGATE --task-definition strands-compose-chat --network-configuration "awsvpcConfiguration={subnets=[<subnet-id>],securityGroups=[<sg-id>],assignPublicIp=DISABLED}" --overrides "containerOverrides=[{name=app,command=[strands-compose-chat,migrate]}]" --query "tasks[0].taskArn" --output text

aws ecs wait tasks-stopped --cluster chat --tasks <task-arn>

aws ecs describe-tasks --cluster chat --tasks <task-arn> --query "tasks[0].containers[0].exitCode" --output text     # expect 0
```

Restart the service so it picks up changed secrets:

```bash
aws ecs update-service --cluster chat --service strands-compose-chat --force-new-deployment
```

Follow the logs:

```bash
aws logs tail /ecs/strands-compose-chat --follow
```

Check health from outside and from the database's point of view:

```bash
curl -s https://chat.example.com/health     # {"status":"ok"}
curl -s https://chat.example.com/ready      # {"status":"ready"}
```

Build and tag the image ([Chapter 11](Chapter_11.md)):

```bash
docker build --build-arg STRANDS_COMPOSE_CHAT_VERSION=0.8.0 -t strands-compose-chat:0.8.0 examples/02-docker
```

[Documentation home](README.md)
