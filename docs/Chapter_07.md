# Chapter 07 — Authentication

People sign in with a local username and password, with a single sign-on provider (OIDC), or both. Scripts and other services use API keys. This chapter explains each, and the session cookie behind them. Variable names are listed in full in [Chapter 09](Chapter_09.md).

<p align="center"><img src="img/login.png" alt="Sign-in page with a password form and an SSO button" width="600"></p>

## Local Accounts

| Topic | Behaviour |
|---|---|
| Storage | Passwords are hashed with Argon2id, so a stolen database does not leak them. Cost is set by `ARGON2_MEMORY_KIB` (64 MiB), `ARGON2_TIME_COST` (3), `ARGON2_PARALLELISM` (4) |
| Minimum length | `PASSWORD_MIN_LENGTH`, default 12. Checked on sign-up and when an admin sets a password. Not checked at sign-in |
| Failure message | One answer, *Invalid credentials.*, for unknown user, wrong password and disabled account. A dummy hash check keeps timing equal |
| Admin-created users | **Admin → Users → Create**. Provider is `Local`. A password is required |

### Self sign-up

Sign-up is controlled by `AUTH_REGISTRATION_ENABLED`:

| Value | Result |
|---|---|
| unset (default) | **On** when no OIDC provider is configured, **off** when at least one is |
| `true` / `false` | Your choice wins |

When on, the sign-in card shows *Sign up*: username (3 to 64 characters from `A-Z a-z 0-9 _ . -`), email, password twice. The new user is signed in at once. A taken username or email gives *Username or email is already taken.*

A new user has the default budget of **$10.00** per month and **no groups**, so they see no agents until an admin adds them to a group ([Chapter 08](Chapter_08.md)).

### Turning local sign-in off

`AUTH_LOCAL_SIGNIN_ENABLED=false` hides the password form and makes `POST /auth/login` return 403. The app refuses to start unless at least one OIDC provider exists, and it forces sign-up off. Local superusers can still use the separate `/admin/login` form ([Chapter 05](Chapter_05.md#getting-in)).

## Single Sign-On (OIDC)

The chat uses the authorization code flow with PKCE (S256), run on the server. Discovery, state, nonce and ID-token signature checks are handled by [Authlib](https://docs.authlib.org/).

### Declaring providers

List provider ids in `OIDC_PROVIDERS` as a JSON array, then give each id its own keys, named `OIDC_<ID>_...` with the id in upper case. Use letters, digits and underscores in ids.

| Key | Required | Meaning |
|---|---|---|
| `OIDC_<ID>_DISCOVERY_URL` | yes | Absolute http(s) URL of `.well-known/openid-configuration` |
| `OIDC_<ID>_CLIENT_ID` | yes | OAuth client id |
| `OIDC_<ID>_CLIENT_SECRET` | no | Leave out for a public client (PKCE only) |
| `OIDC_<ID>_SCOPES` | no | Default `openid email profile`. `openid` is always added |
| `OIDC_<ID>_USERNAME_CLAIM` | no | Claim used as username. Default `preferred_username` |
| `OIDC_<ID>_DISPLAY_NAME` | no | Button label. Default: the id |

A missing required key stops the app at startup, and the error names the provider and key. Duplicate ids (case-insensitive) are rejected. The sign-in page shows one **Sign in with ...** button per provider.

> **Watch out:** `OIDC_<ID>_LOGOUT_URL` is read but never used. Nothing calls it today, so do not rely on it.

### Redirect URI

Register this callback with your identity provider:

```text
https://<your-host><URL_PREFIX>/auth/callback
```

Set `OIDC_REDIRECT_URI` to that exact value. If it is unset, the app infers it from the request and logs the inferred value at INFO each time a sign-in starts. Behind a load balancer the inferred scheme depends on `X-Forwarded-Proto`, so an explicit value is safer.

### First sign-in (JIT provisioning)

The first time someone signs in, the chat creates the user:

- Matched by provider (`oidc:<id>`) and the `sub` claim.
- Username comes from the username claim. If that claim is missing, `sub` is used. If the name is taken, a six character suffix is added (`anna-Xk3p9Q`).
- Email comes from the `email` claim. On later sign-ins a changed email is updated; the username is not.
- Never a superuser, default $10.00 budget, no groups. Promote and grant groups in the admin.
- A deactivated user gets *Your account is deactivated.*

The same person signing in through two providers becomes two users.

### IdP checklist

| Step | Microsoft Entra ID | Okta |
|---|---|---|
| App type | App registration, platform **Web** | OIDC Web application, grant **Authorization Code** |
| Redirect URI | the callback above | the callback above |
| Secret | Create a client secret | Copy the client secret |
| Discovery URL | `https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration` | `https://<org>.okta.com/.well-known/openid-configuration` |
| Claims | Add the optional `email` claim to the ID token | `email` and `profile` scopes |
| Access | Assign users or allow all | Assign users or groups to the app |

## API Keys

An API key lets a script call the chat as a given user.

1. A superuser opens **Admin → API Keys → Create** and sets a **Name**, the owning **User** and a required future **Expires At**.
2. The full key appears once in a dialog. Copy it then. Only its SHA-256 hash is stored.
3. The list shows owner, expiry, last use and revoke time. The detail page adds the key prefix (`sck_` plus 8 characters), which is also searchable, so you can match a key to a log line.

![API keys list](img/admin-api-keys.png)

A key looks like `sck_` followed by 43 random URL-safe characters. Send it as a bearer token:

```bash
curl -H "Authorization: Bearer sck_..." https://chat.example.com/api/v1/agents
```

| Accepted with a key | Needs a browser session |
|---|---|
| `POST /api/v1/invocations` | Everything else: sessions, `/auth/me`, usage, analytics, admin |
| `GET /api/v1/agents`, `GET /api/v1/agents/{id}` | |
| `GET /api/v1/media/capabilities` | |

The key acts as its owner: same groups, same budget, and conversations land in the owner's history. A missing, unknown, revoked or expired key, or an inactive owner, all return the same `401 Authentication required`. A bearer token that does not start with `sck_` is also a 401 and never falls back to the cookie. Use **Revoke** to disable a key ([Chapter 05](Chapter_05.md#soft-versus-hard-delete)). Full request and stream format: [Chapter 14](Chapter_14.md).

## The Session Cookie

| Setting | Value |
|---|---|
| Name | `SESSION_COOKIE_NAME`, default `strands_chat_session` |
| Content | Signed with `SESSION_SECRET_KEY` (not encrypted). Holds the user id |
| Lifetime | `SESSION_TTL_SECONDS`, default 43200 (12 h) from sign-in. Activity does not extend it |
| SameSite | `lax` |
| HttpOnly | yes |
| Secure | Yes unless `APP_ENV=dev`. Over plain HTTP in any other mode the browser drops the cookie and sign-in appears to do nothing |
| Path | `URL_PREFIX`, or `/` when empty |

Every request re-reads the user, so deactivating an account cuts access straight away. Changing `SESSION_SECRET_KEY` signs everyone out.

**Sign out** calls `GET /auth/logout`, clears the session and returns to the login page. It does not end the identity provider's own session, so *Sign in with ...* may log you straight back in.

## Next

[Chapter 08 — Access, Budgets and Pricing](Chapter_08.md)
