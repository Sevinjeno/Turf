
# Auth Flow

        App opens
        → index.tsx
        → check refreshToken

        IF exists:
        → go /(tabs)

        ELSE:
        → go /login

        Login:
        → send OTP
        → verify OTP
        → store tokens

        After login:
        → redirect /(tabs)

        App restarts:
        → auto login


## Auth Routes

        POST /auth/email/send-otp

        POST /auth/email/verify-otp

        POST /auth/phone/send-otp

        POST /auth/phone/verify-otp

        POST /auth/refresh

        GET  /auth/logout

## User Routes

        GET /users/me        

        POST /users/login

        POST /users/


