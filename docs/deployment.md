# Deployment — RentRayda

## Production deploy flow

1. Push to main → GitHub Actions: typecheck → lint → build → test
2. Coolify webhook → Docker build → zero-downtime deploy
3. Verify: `curl https://rentrayda.ph/api/health` → `{ status: 'ok' }`
4. Verify: Sentry clean, full flow works on production

## Infrastructure

- Hosting: DigitalOcean Droplet (4 GiB RAM, 2 vCPU, 80 GiB SSD) — $24/mo
- Deploy tool: Coolify 4.x (self-hosted, free, web GUI)
- CI: GitHub Actions (typecheck → lint → build → test)
- Monitoring: Sentry (error tracking)

## Post-deploy checklist

- [ ] API health endpoint returns 200
- [ ] Web landing page loads
- [ ] SMS OTP flow works end-to-end
- [ ] File uploads to R2 succeed
- [ ] Admin dashboard accessible
