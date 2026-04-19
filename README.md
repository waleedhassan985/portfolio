# Waleed's Portfolio - Data Scientist & AI Developer

A **modern, sleek, professional** portfolio website built with pure HTML5, CSS3, and vanilla JavaScript. Features smooth animations, custom cursor effects, and a responsive design that looks stunning on all devices.

![Lighthouse Score: 95+](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-blue)
![No Frameworks](https://img.shields.io/badge/Frameworks-0-orange)
![Modern Design](https://img.shields.io/badge/Design-Modern-purple)

---

## ✨ Modern Design Features

### Visual Excellence
- 🎨 **Sleek Dark Theme** - Deep navy background with modern green accents
- ✨ **Smooth Animations** - Fade-in, slide-in, and scale effects on scroll
- 🖱️ **Custom Cursor** - Interactive cursor effect for desktop users
- 🌊 **Floating Elements** - Animated background gradients
- 💫 **Card Hover Effects** - Elevation and transitions on interactive elements
- 🎯 **Gradient Buttons** - Modern buttons with ripple effects

### Interactive Components
- 🎡 **Testimonials Carousel** - Auto-rotating with touch swipe support
- 🏆 **Timeline Section** - Visual career progression
- 💼 **Skills Grid** - Interactive skill cards with hover tooltips
- 📝 **Enhanced Forms** - Real-time validation with smooth feedback
- ⬆️ **Back-to-Top Button** - Smooth scroll to top
- 🔍 **Lazy Loading** - Optimized image loading

### Performance & UX
- **LCP < 2.0s** - Lightning-fast page loads
- **Mobile-First** - Responsive design for all screen sizes
- **Touch-Friendly** - 44×44px minimum touch targets
- **Smooth Scrolling** - Intersection Observer for scroll animations
- **Reduced Motion** - Respects accessibility preferences
- **Zero Dependencies** - No frameworks, maximum performance

---

## 📁 Project Structure

```
Portfolio By me/
├── index.html                      # Homepage with hero section
├── sitemap.xml                     # Search engine sitemap
├── robots.txt                      # Crawler instructions
├── QUICK-START.md                  # 5-minute setup guide
├── MODERN-DESIGN-GUIDE.md          # Complete implementation guide
│
├── assets/
│   ├── css/
│   │   ├── base.css                    # Design tokens, typography, colors
│   │   ├── components.css              # Reusable UI components
│   │   ├── modern-enhancements.css     # NEW: Modern animations & effects
│   │   └── responsive-breakpoints.css  # NEW: Responsive patterns reference
│   │
│   ├── js/
│   │   ├── main.js                     # Core functionality
│   │   └── modern-interactions.js      # NEW: Animations, carousel, cursor
│   │
│   ├── data/
│   │   └── projects.json               # Project data (6 projects)
│   │
│   └── img/
│       ├── waleed.jpg                  # Profile photo
│       ├── og-image.jpg                # Social share image
│       └── projects/                   # Project screenshots (WebP format)
│
├── projects/
│   ├── index.html                      # Projects listing with filters
│   ├── pdf-qa-chatbot.html             # PDF Q&A Chatbot case study
│   ├── qa-chatbot-groq.html            # Q&A Chatbot with Groq
│   ├── sales-analytics-dashboard.html  # Sales dashboard case study
│   ├── social-media-dashboard.html     # Social media analytics dashboard
│   ├── student-depression-prediction.html # ANN depression prediction app
│   └── titanic-survival-prediction.html   # Titanic ML case study
│
├── about/
│   └── index.html                 # About page
│
├── services/
│   └── index.html                 # Services page
│
├── blog/
│   └── index.html                 # Blog listing (optional)
│
└── contact/
    └── index.html                 # Contact form page
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Markup** | HTML5 (semantic elements) |
| **Styling** | CSS3 (custom properties, grid, flexbox) |
| **Scripting** | Vanilla JavaScript (ES6+) |
| **Icons** | Inline SVG |
| **Fonts** | System font stack (zero external requests) |
| **Analytics** | Plausible/GA4 (commented out by default) |

---

## 🎨 Design System

### Color Palette

```css
/* Dark Mode (default) */
--bg: #0b1220        /* Deep navy background */
--elev: #0f172a      /* Elevated panels */
--text: #e6eaf2      /* Primary text */
--muted: #9aa4b2     /* Secondary text */
--accent: #30c48d    /* Python-success green */
--accent-2: #7aa2f7  /* Calm blue for links */
--border: #24405a    /* Border color */
```

### Typography

- **Font Stack**: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`
- **Sizes**: Fluid clamp() values from 14px–64px
- **Line Height**: 1.6 for body, 1.25 for headings

### Spacing

8-point system: `8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px`

### Breakpoints

| Name | Width | Use Case |
|------|-------|----------|
| Mobile | 0–479px | Single column, full-width buttons |
| Small Mobile | 480–767px | 2-column grids |
| Tablet | 768–1023px | 3-column grids, horizontal nav |
| Desktop | 1024–1439px | 4-column grids |
| Large Desktop | 1440px+ | Max content width 1200px |

---

## 🚀 Deployment

### Option 1: GitHub Pages

1. Push code to GitHub repo
2. Go to **Settings** → **Pages**
3. Select branch `main` and folder `/` (root)
4. Your site will be live at `https://username.github.io/repo-name/`

### Option 2: Netlify

1. Create account at [netlify.com](https://netlify.com)
2. Drag-and-drop the project folder
3. Or connect GitHub repo for automatic deploys
4. Custom domain: **Domains** → **Add custom domain**

### Option 3: Vercel

```bash
npm i -g vercel
cd "Portfolio By me"
vercel
```

Follow prompts. Site goes live instantly.

### Option 4: Any Static Host

Upload files via FTP to any web host (Bluehost, SiteGround, etc.). Ensure `index.html` is in root.

---

## ✏️ Customization Guide

### 1. Update Personal Info

**File:** `index.html`, `about/index.html`, `contact/index.html`, etc.

**Find and replace:**

```
{NAME} → Waleed Hassan
{TAGLINE} → Data Scientist & AI Developer
{EMAIL} → info@dswaleed.live
{LOCATION} → Green Avenue Islamabad, Pakistan
{GITHUB} → https://github.com/waleedhassan985
{LINKEDIN} → https://www.linkedin.com/in/waleed-hassan-091804279/
{RESUME_PDF} → /assets/Waleed_Resume.pdf
{AVATAR_IMG} → /assets/img/waleed.jpg
```

### 2. Add New Project

**Create:** `projects/new-project.html`

**Copy template from:** `projects/pdf-qa-chatbot.html`

**Update:**
- Title, description, tags
- Problem → Approach → Results sections
- Code snippets, architecture diagram
- GitHub/demo links

**Add to:** `projects/index.html` and `index.html` (featured section)

**Update sitemap:** Add new URL to `sitemap.xml`

### 3. Change Colors

**File:** `assets/css/base.css`

**Edit CSS custom properties:**

```css
:root {
  --accent: #30c48d;   /* Change to your brand color */
  --accent-2: #7aa2f7; /* Secondary accent */
}
```

All components automatically update.

### 4. Enable Analytics

**Plausible (recommended):**

Uncomment in `index.html` (bottom):

```html
<script defer data-domain="dswaleed.live" src="https://plausible.io/js/script.js"></script>
```

**Google Analytics 4:**

Uncomment GA4 block and add your tracking ID:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 5. Contact Form Backend

**Default:** Client-side validation only (no real submission).

**Option A - Formspree:**

1. Sign up at [formspree.io](https://formspree.io)
2. Create new form
3. Update `contact/index.html`:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option B - Netlify Forms:**

Add `netlify` attribute:

```html
<form id="contact-form" name="contact" method="POST" netlify>
```

**Option C - Custom Backend:**

Point `action` to your API endpoint (Node.js, Python Flask, etc.)

---

## 🖼️ Adding Images

### Profile Photo

- **Path:** `/assets/img/waleed.jpg`
- **Size:** 500×500px (square)
- **Format:** WebP or JPG
- **Weight:** < 120KB

### Project Screenshots

- **Path:** `/assets/img/projects/project-name.webp`
- **Size:** 800×500px (16:10 ratio)
- **Format:** WebP (use [Squoosh](https://squoosh.app) to convert)
- **Weight:** < 100KB per image

### Social Share Image

- **Path:** `/assets/img/og-image.jpg`
- **Size:** 1200×630px
- **Format:** JPG
- **Update in:** All HTML `<meta property="og:image">` tags

---

## 🧪 Testing

### Performance (Lighthouse)

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://dswaleed.live --view
```

**Target Scores:**
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

### Accessibility

**Tools:**
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Screen reader: NVDA (Windows), VoiceOver (Mac)

**Manual checks:**
- Tab through all interactive elements
- Test with keyboard only (no mouse)
- Check color contrast (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))

### Cross-Browser

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop + iOS)
- Mobile browsers (Android Chrome, iOS Safari)

---

## 📊 Performance Budgets

| Metric | Target | Actual |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.0s | TBD |
| **TBT** (Total Blocking Time) | < 150ms | TBD |
| **CLS** (Cumulative Layout Shift) | < 0.1 | TBD |
| **Page Weight** | < 500KB | TBD |
| **Requests** | < 20 | TBD |

---

## 🔒 Security Headers

Add these to your hosting provider (Netlify: `netlify.toml`, Vercel: `vercel.json`):

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

## 📝 Content Guidelines

### Writing Case Studies

Follow this structure:

1. **Summary** (1 paragraph): Problem + solution + impact
2. **Metrics Highlight**: Quantified outcomes upfront
3. **Problem/Context**: What was broken? Why did it matter?
4. **Approach**: Tech stack, architecture, implementation steps
5. **Results**: Quantitative + qualitative outcomes
6. **Lessons Learned**: What worked, what didn't, what you'd do differently
7. **Reproducibility**: Code snippets, GitHub links, tech stack

**Example metrics:**
- "Cut reporting time by 90% (6h → 15min)"
- "Improved model AUC from 0.71 → 0.84"
- "Reduced churn by 8% in two quarters"

---

## 🤝 Contributing

Found a bug or want to suggest an improvement?

1. Open an issue on GitHub
2. Fork the repo
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📜 License

### Code

MIT License - feel free to use this template for your own portfolio.

### Content

All written content (blog posts, case studies, project descriptions) is © 2025 Waleed Hassan. Do not copy.

### Images

Placeholder images are CC0/royalty-free. Replace with your own.

---

## 🙏 Credits

- **Design Inspiration**: Minimal, content-first portfolios
- **Icons**: Inline SVG from Heroicons/Feather Icons
- **Fonts**: System font stack (no external requests)
- **Color Palette**: Custom, inspired by Tokyo Night theme

---

## 📧 Contact

**Waleed**  
Data Scientist & AI Developer

- 🌐 Website: [dswaleed.live](https://dswaleed.live)
- 📧 Email: info@dswaleed.live
- 💼 LinkedIn: [linkedin.com/in/waleed-hassan-091804279](https://www.linkedin.com/in/waleed-hassan-091804279/)
- 🐙 GitHub: [github.com/waleedhassan985](https://github.com/waleedhassan985)

---

**Built with ❤️ and no frameworks. Pure HTML5, CSS3, and vanilla JavaScript.**
