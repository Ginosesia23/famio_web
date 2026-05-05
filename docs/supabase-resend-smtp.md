# Supabase Auth email via Resend (SMTP)

This project’s **Vite SPA does not send email**. Password reset and signup confirmations are sent by **Supabase Auth**. To use **Resend**, configure **Custom SMTP** in the Supabase Dashboard (or use Resend’s “Connect to Supabase” integration).

## 1. Resend

1. Verify a **sending domain** in [Resend Domains](https://resend.com/domains).
2. Create an **API key** (starts with `re_`). Keep it secret.

## 2. Supabase Dashboard

1. Open your project → **Authentication** → **Notifications** (or **Emails** / **SMTP**, depending on UI version).
2. Enable **Custom SMTP**.
3. Use Resend’s SMTP relay (see [Resend + Supabase](https://resend.com/docs/send-with-supabase-smtp)):

| Field | Value |
|--------|--------|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) or `587` (STARTTLS) |
| Username | `resend` |
| Password | Your Resend API key (`re_…`) |

4. Set **Sender email** to an address on your verified domain (e.g. `Famio <noreply@yourdomain.com>`).

5. Save.

## 3. Redirect URLs (critical for password reset)

Supabase compares the **`redirectTo`** value from `resetPasswordForEmail` to this list.  
If it doesn’t match, Supabase sends users to **Site URL** (`/`), and the magic link exchange often fails (`otp_expired`, `access_denied`).

1. Under **Authentication** → **URL configuration**:
   - **Site URL** — your canonical marketing URL, e.g. `https://www.famio.co.uk`  
     Match **apex vs www** exactly to what users use (`www` ≠ bare domain).
   - **Redirect URLs** — add explicit patterns, for example:
     - `https://www.famio.co.uk/reset-password`
     - `https://www.famio.co.uk/**`  

2. Deploy the app with **`VITE_AUTH_SITE_URL=https://www.famio.co.uk`** (no trailing slash) so production builds always request reset emails with that origin in `redirectTo`.

3. For local testing add `http://localhost:5173/reset-password` (and/or `…/**`) as allowed.

The app forwards valid recovery fragments from `/` → `/reset-password` when Supabase incorrectly lands users on the home page, but **allowlisted `redirectTo` is still required** for a reliable first redirect.

### “Email link invalid or expired” (`otp_expired`)

Common causes:

- **Link consumed twice** — some mail clients or security gateways prefetch URLs; that burns the one-time OTP. Request a **new** email and open the link once, preferably by copying into your browser’s address bar.
- **Actual expiry** — increase OTP/email link expiry in Supabase Auth settings if needed.
- **Redirect / Site URL mismatch** — fix allowlists and **`VITE_AUTH_SITE_URL`** as above.

## 4. Local `.env` and `RESEND_API_KEY`

- **`RESEND_API_KEY` in `.env` is not read by the frontend.** Vite only exposes variables prefixed with `VITE_`. The key is for your own reference, scripts, or a future server — **you still paste the same value into Supabase SMTP “Password”** (or use the Resend integration wizard).
- **Never** add `VITE_RESEND_*` — that would ship the key to every browser.

## 5. Rate limits

Supabase’s built-in email provider is heavily rate-limited in production. Custom SMTP (Resend) is the right approach for real traffic.
