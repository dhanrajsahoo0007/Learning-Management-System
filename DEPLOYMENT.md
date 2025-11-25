# Deploying Learning Management to Cloudflare Pages

This guide will help you deploy the Learning Management application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works fine)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 20+ installed locally (for testing)

## Deployment Methods

### Method 1: Automatic Deployment via Git Integration (Recommended)

This is the easiest method - Cloudflare Pages will automatically deploy your site whenever you push to your repository.

#### Step 1: Push Your Code to Git

```bash
# If you haven't already, initialize git and push to your repository
git add .
git commit -m "Add Cloudflare Pages configuration"
git push origin main
```

#### Step 2: Connect to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Select your Git provider and authorize Cloudflare
4. Select the `Learning-Management` repository
5. Click **Begin setup**

#### Step 3: Configure Build Settings

Use these settings in the Cloudflare Pages setup:

- **Production branch**: `main` (or your default branch)
- **Build command**: `cd frontend && npm install && npm run build`
- **Build output directory**: `frontend/dist`
- **Root directory**: `/` (leave empty or use root)

**Environment variables** (optional):

- `NODE_VERSION`: `20`
- `NPM_VERSION`: `10`

#### Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site
3. Your site will be available at `https://your-project.pages.dev`

---

### Method 2: Manual Deployment via Wrangler CLI

For one-time deployments or testing.

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Login to Cloudflare

```bash
wrangler login
```

#### Step 3: Build Your Application

```bash
cd frontend
npm install
npm run build
```

#### Step 4: Deploy

```bash
# From the project root
wrangler pages deploy frontend/dist --project-name=learning-management
```

---

## Configuration Files

The following files have been created for Cloudflare Pages deployment:

### 1. `wrangler.toml`

Located at the project root. Contains:

- Build configuration
- Environment variables
- Security headers
- Caching rules
- SPA routing redirects

### 2. `frontend/public/_headers`

Configures HTTP headers for:

- Security (CSP, X-Frame-Options, etc.)
- Caching strategies for assets
- Service Worker configuration

### 3. `frontend/public/_redirects`

Handles SPA routing by redirecting all routes to `index.html`

---

## Post-Deployment Configuration

### Custom Domain (Optional)

1. In Cloudflare Pages, go to your project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

### Environment Variables

If you need to add environment variables:

1. Go to your project in Cloudflare Pages
2. Click **Settings** > **Environment variables**
3. Add variables for Production and/or Preview environments
4. Redeploy for changes to take effect

### Preview Deployments

Cloudflare Pages automatically creates preview deployments for:

- Every pull request
- Every branch (optional)

Preview URLs: `https://<branch>.<project>.pages.dev`

---

## Build Optimization

The configuration includes several optimizations:

### Caching Strategy

- **Static assets** (`/assets/*`): Cached for 1 year (immutable)
- **Fonts**: Cached for 1 year
- **HTML files**: No cache (always fresh)
- **Service Worker**: No cache (always fresh)

### Security Headers

- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Referrer Policy
- Permissions Policy

### Performance

- Cloudflare's global CDN
- HTTP/2 and HTTP/3 support
- Brotli compression
- Automatic image optimization (via Cloudflare)

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails
**Solution**:

- Check that Node version is set to 20+
- Verify all dependencies are in `package.json`
- Check build logs in Cloudflare dashboard

### 404 Errors on Routes

**Issue**: Direct navigation to routes returns 404
**Solution**:

- Verify `_redirects` file exists in `frontend/public/`
- Check that it's being copied to the build output
- Ensure the redirect rule is: `/*    /index.html   200`

### Assets Not Loading

**Issue**: CSS/JS files return 404
**Solution**:

- Verify build output directory is set to `frontend/dist`
- Check that Vite is building assets correctly
- Inspect the `dist` folder structure

### Environment Variables Not Working

**Issue**: Environment variables are undefined
**Solution**:

- In Vite, env vars must be prefixed with `VITE_`
- Add them in Cloudflare Pages settings
- Redeploy after adding variables

---

## Continuous Deployment

With Git integration, deployments are automatic:

1. **Push to main branch** → Production deployment
2. **Push to other branches** → Preview deployment
3. **Open pull request** → Preview deployment with unique URL

### Deployment Status

Monitor deployments in:

- Cloudflare Dashboard > Your Project > Deployments
- Git commit status checks
- Email notifications (configure in settings)

---

## Performance Monitoring

Cloudflare provides analytics for:

- Page views
- Unique visitors
- Bandwidth usage
- Geographic distribution
- Performance metrics

Access via: **Cloudflare Dashboard** > **Your Project** > **Analytics**

---

## Rollback

To rollback to a previous deployment:

1. Go to **Deployments** in Cloudflare Pages
2. Find the deployment you want to rollback to
3. Click **...** > **Rollback to this deployment**
4. Confirm the rollback

---

## Cost

Cloudflare Pages is **free** for:

- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- 1 build at a time

Perfect for this project! 🎉

---

## Next Steps

1. **Deploy your site** using Method 1 or 2
2. **Set up a custom domain** (optional)
3. **Configure environment variables** if needed
4. **Monitor your deployments** in the Cloudflare dashboard

Your Learning Management application is now ready for production! 🚀
