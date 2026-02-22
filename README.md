# Scott Everett - Interactive Resume

A bold, animated React-based interactive resume showcasing my work as a Sr. UX/UI Designer & Educator.

## Features

- **Bold Yellow/Black Branding** - Matches your personal brand identity
- **Scroll Animations** - Smooth, engaging animations as users scroll
- **Interactive Timeline** - Visual career history with hover effects
- **Filterable Project Gallery** - Filter projects by category
- **Skills Display** - Organized skill categories with hover interactions
- **Contact Form** - Ready for backend integration
- **Fully Responsive** - Works on all devices

## Getting Started

### Prerequisites

You'll need Node.js installed on your computer. Download it from:
https://nodejs.org/ (LTS version recommended)

### Installation

1. Open Terminal and navigate to this folder:
   ```bash
   cd "/Users/scotteverett/Library/CloudStorage/GoogleDrive-scotteverett313@gmail.com/My Drive/SE Design | House/Claude Code/interactive-resume"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Customization

### Adding Your Photo

Replace the placeholder in `src/components/Hero.js` and `src/components/About.js` with your actual image:

```jsx
<img src="/path/to/your-photo.jpg" alt="Scott Everett" className="hero-img" />
```

### Updating Social Links

Edit the `socialLinks` array in `src/components/Footer.js` with your actual URLs.

### Contact Form Integration

The contact form currently logs to console. To make it functional:
1. Use a service like Formspree, EmailJS, or Netlify Forms
2. Or connect to your own backend API

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build` folder, ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## Tech Stack

- React 18
- Framer Motion (animations)
- React Intersection Observer (scroll triggers)
- CSS Custom Properties (theming)

## Project Structure

```
interactive-resume/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Experience.js
│   │   ├── Skills.js
│   │   ├── Projects.js
│   │   ├── Education.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── App.js
│   └── index.js
└── package.json
```
