# HSHandymen LLC - Landing Page Specification

## Project Overview

**Brand:** HSHandymen LLC
**Location:** Mammoth Lakes & Eastern Sierra, California
**Services:** Handyman Services + Networking & IoT Solutions
**Target Audience:** Homeowners, property managers, vacation rental owners in Eastern Sierra region
**Page Purpose:** High-conversion landing page showcasing premium handyman and tech services

## Design Philosophy

A cinematic, award-winning landing page that captures the rugged beauty of the Eastern Sierra mountains while conveying trust, expertise, and premium service quality. The design balances craftsmanship heritage with modern technology expertise.

## Hero Section

### Visual Strategy
- **Hero Video:** Cinematic aerial footage of Mammoth Lakes / Eastern Sierra mountains with golden hour light, transitioning to cozy cabin interior shots
- **Mood:** Warm, inviting, professional, mountain rustic elegance
- **Video Style:** Shot on Arri Alexa, 35mm lens, f/1.8 shallow depth of field, slow-motion, cinematic lighting, hyper-realistic

### Typography
- **Headline:** Space Grotesk, 700 weight, 72px (desktop) / 48px (mobile)
- **Subheadline:** Inter, 400 weight, 20px
- **Color:** White with subtle text-shadow for contrast

### Layout
- Full viewport height (100vh)
- Video as background, muted autoplay
- Centered content with CTA buttons
- Scroll indicator at bottom

## Color Palette

### Primary Colors
- **Primary Dark:** #0D1117 (deep charcoal)
- **Secondary Dark:** #161B22 (elevated dark)
- **Accent Orange:** #FF6B35 (CTA, highlights)
- **Accent Cyan:** #00D9FF (tech elements)
- **Accent Green:** #00FF88 (success states)

### Typography Colors
- **Text Primary:** #F0F6FC (white)
- **Text Secondary:** #8B949E (muted)

### Background
- Dark theme with subtle gradients
- Glass-morphism effects for cards

## Layout Structure

### Sections (in order)

1. **Hero** - Full-screen video with headline + CTA
2. **Service Area Banner** - "Proudly serving Mammoth Lakes, Bishop, June Lake, Crowley Lake & Eastern Sierra"
3. **Services Grid** - Two columns: Handyman (orange) + Tech (cyan)
4. **Trust Indicators** - Stats: 500+ Projects, 15+ Years, 98% Satisfaction
5. **Why Choose Us** - 4 feature cards
6. **Service Area Map/Visual** - Geographic coverage
7. **Testimonials** - Carousel with Eastern Sierra references
8. **Contact/CTA** - Quote form with service dropdown
9. **Footer** - Contact info, service area, branding

## Typography System

### Font Families
- **Headings:** Space Grotesk (Google Fonts)
- **Body:** Inter (Google Fonts)

### Scale
- Hero Title: 72px / 700
- Section Titles: 48px / 700
- Card Titles: 24px / 600
- Body: 16px / 400
- Small/Labels: 14px / 500

## Motion & Animations

### CSS Animations
- **Float:** Subtle floating motion for decorative elements (6s ease-in-out infinite)
- **Pulse Glow:** CTA button glow effect (3s ease-in-out infinite)
- **Slide Up:** Content reveal on scroll (0.8s ease-out)
- **Fade In:** Section transitions
- **Counter Animation:** Number count-up on viewport entry

### Interactions
- Hover states on all interactive elements
- Smooth scroll navigation
- Form validation with visual feedback
- Loading states on button submission

## Component Library

### Buttons
- **Primary:** Orange gradient, white text, shadow, hover scale
- **Outline:** Cyan border, transparent, hover fill
- **Large:** Increased padding for CTAs

### Cards
- **Service Card:** Glass effect, colored border, hover lift
- **Feature Card:** Icon + title + description, hover translate
- **Portfolio Card:** Image background, overlay gradient, zoom on hover

### Form Elements
- Dark inputs with cyan focus glow
- Custom select dropdown
- Textarea with auto-resize potential
- Submit button with loading state

## Responsive Breakpoints

- **Desktop:** 1280px max-width container
- **Tablet:** 1024px (stack grids to single column)
- **Mobile:** 768px (full-width elements, hamburger menu)

## Technical Implementation

### Stack
- Pure HTML5, CSS3, Vanilla JavaScript
- No build tools required
- External: Google Fonts, Supabase client

### Performance
- Lazy loading for below-fold images
- Minimal JavaScript
- CSS animations (GPU-accelerated)
- Video optimization (compressed MP4)

### Supabase Integration
- Quote form submission
- Customer data collection
- Status tracking (future)

## Content Details

### Hero
- **Headline:** "Eastern Sierra's Trusted Handyman & Tech Experts"
- **Subhead:** "Expert craftsmanship meets cutting-edge technology. Serving Mammoth Lakes, Bishop, June Lake, and beyond."
- **CTA:** "Get Your Free Quote"

### Services - Handyman
1. General Repairs (drywall, painting, fixtures)
2. Plumbing & Winterization
3. Heating Systems (furnaces, pellet stoves)
4. Carpentry & Decks
5. Flooring
6. Winter Preparation

### Services - Tech
1. Network Installation
2. WiFi Optimization
3. Smart Home Setup
4. Security Systems
5. Server & Backup
6. AV & Entertainment

### Testimonials
1. "HSHandymen transformed our Mammoth Lakes kitchen into a modern masterpiece." - Michael R., Homeowner
2. "They installed our Bishop office network. Professional and knowledgeable about mountain challenges." - Sarah C., Business Owner
3. "Reliable for our vacation rentals. Quick response even during ski season!" - James W., Property Manager

### Contact Info
- **Phone:** (760) 576-9009
- **Email:** info@hs-handymen.com
- **Service Area:** Mammoth Lakes, Bishop, June Lake, Crowley Lake & Eastern Sierra
