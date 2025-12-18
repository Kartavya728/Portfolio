# Portfolio Customization Guide

## Quick Customization Checklist

### 1. Contact Information

**File:** `components/Contact.tsx`

Update these email links with your actual email:

```tsx
// Line 35 - Email link
link: "mailto:kartavya.portfolio@example.com",

// Line 64 - Direct email
kartavya.portfolio@example.com

// Line 80 - CTA button link
window.location.href = "mailto:your.email@example.com";
```

### 2. Social Media Links

**File:** `components/Contact.tsx`

Update the contact links with your actual profiles:

```tsx
{
  title: "GitHub",
  link: "https://github.com/YOUR_USERNAME",
  ...
},
{
  title: "LinkedIn",
  link: "https://linkedin.com/in/YOUR_PROFILE",
  ...
},
{
  title: "Twitter",
  link: "https://twitter.com/YOUR_HANDLE",
  ...
},
```

### 3. Skills Section

**File:** `components/Skills.tsx`

Modify the skill categories and proficiency levels:

```tsx
const skillCategories = [
  {
    category: "Your Category",
    skills: [
      { name: "Skill Name", level: "Advanced" }, // Advanced/Intermediate
      // Add more skills
    ],
  },
];
```

### 4. Core Expertise

**File:** `public/data/core_expertise_data/index.ts`

Update expertise areas (file already has good structure, just modify data):

```tsx
{
  id: 1,
  title: "Your Expertise",
  description: "Your description here",
  skills: ["Skill1", "Skill2"],
  level: "Advanced",
}
```

### 5. Technical Projects

**File:** `components/TechnicalProjects.tsx`

Add your actual projects:

```tsx
const technicalProjects = [
  {
    id: 1,
    title: "Your Project Name",
    description: "Project description",
    technologies: ["Tech1", "Tech2"],
    github: "https://github.com/your-repo",
    live: "https://your-project-url",
  },
  // Add more projects
];
```

### 6. Leadership Roles

**File:** `components/ExperienceAndLeadership.tsx`

Update leadership roles array:

```tsx
const leadershipRoles = [
  {
    id: 1,
    title: "Your Role Title",
    organization: "Organization Name",
    role: "Your Position",
    duration: "2024 - Present",
    description: "What you did",
    icon: "📊", // Change emoji
  },
];
```

### 7. Certification Links

**File:** `public/data/certifications_data/index.ts`

Update credential URLs:

```tsx
{
  id: 1,
  title: "Your Certification",
  issuer: "Issuer Name",
  date: "2024",
  description: "Description",
  credentialUrl: "https://credential-url-here", // Add actual URL
}
```

### 8. Featured Projects

**File:** `data/index.ts`

The projects array in this file appears in the FeaturedProjects section.
Update project data, images, and descriptions.

## Styling Customization

### Color Scheme

All components use purple and blue gradient colors. To change the theme:

1. **Gradient Colors** - Search for `text-purple`, `bg-purple`, `from-purple`, `to-blue` in components
2. **Tailwind Classes** - Modify color variants (e.g., `purple-400` → `indigo-400`)
3. **Global Styles** - Check `app/globals.css` and `tailwind.config.ts`

### Common Color Updates

```tsx
// Purple theme elements
from-purple-600 → from-your-color-600
to-purple-600 → to-your-color-600
text-purple → text-your-color
border-purple-500 → border-your-color-500

// Blue theme elements
to-blue-600 → to-your-color-600
text-blue → text-your-color
```

### Spacing & Sizing

- Container max-width: `max-w-7xl` (in page.tsx)
- Section padding: `py-20` (can change to `py-16` or `py-24`)
- Grid gaps: `gap-10` or `gap-6` (adjust responsive grid gaps)

## Component Structure Reference

### Typical Card Component Structure

```tsx
{
  /* Gradient background */
}
<div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-xl transition-all" />;

{
  /* Content */
}
<div className="relative z-10">{/* Your content here */}</div>;
```

## Testing Checklist

- [ ] All email links work correctly
- [ ] All social media links are correct
- [ ] Navbar navigation works for all sections
- [ ] Mobile responsive design looks good
- [ ] All hover effects work smoothly
- [ ] Images load correctly
- [ ] Colors match your personal brand

## Additional Features to Consider

1. Add animations using Framer Motion
2. Implement smooth scroll behavior
3. Add form validation for contact section
4. Include project filtering/search
5. Add testimonials or recommendations section
6. Implement dark/light mode toggle
7. Add animation on scroll effects
8. Include download resume functionality

## Performance Tips

- Optimize images using Next.js Image component
- Use lazy loading for components
- Implement code splitting for faster load times
- Consider adding analytics

## SEO Improvements

- Update meta tags in `app/layout.tsx`
- Add structured data (JSON-LD)
- Ensure all text is readable by search engines
- Add sitemap and robots.txt
