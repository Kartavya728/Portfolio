# Portfolio Structure Overview

## 📱 Navigation Bar

```
About Me | Skills | Projects | Achievements | Certifications | Experience | Contact
```

## 🎨 Portfolio Page Flow

### 1. **Hero Section** 🚀

- First impression with spotlight effects
- Your intro with CTA to download resume

### 2. **About Me Section** 📝

- Bento grid layout showcasing your intro
- Personal info and key highlights
- Tech stack display

### 3. **Skills Section** 💡

```
┌─────────────┬─────────────┬─────────────┬──────────────┐
│  Frontend   │  Backend    │   AI/ML     │ Tools/Others │
│ • React     │ • Node.js   │ • Python    │ • Git        │
│ • Next.js   │ • Express   │ • TF        │ • C++        │
│ • TS        │ • MongoDB   │ • OpenCV    │ • DSA        │
└─────────────┴─────────────┴─────────────┴──────────────┘
```

- 4 skill categories
- Visual proficiency indicators
- Interactive progress bars

### 4. **Core Expertise Section** 🎯

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Full Stack Dev │ │ Machine Learn  │ │ Frontend Dev   │
│ Advanced       │ │ Intermediate   │ │ Advanced       │
└────────────────┘ └────────────────┘ └────────────────┘

┌────────────────┐ ┌────────────────┐
│ Backend Dev    │ │ Competitive    │
│ Intermediate   │ │ Programming    │
└────────────────┘ └────────────────┘
```

- 5 expertise areas with detailed descriptions
- Skill tags for each area
- Proficiency levels

### 5. **Featured Projects Section** 🌟

```
┌──────────────────┐ ┌──────────────────┐
│  Project 1       │ │  Project 2       │
│  [Image]         │ │  [Image]         │
│  [Description]   │ │  [Description]   │
│  View → GitHub   │ │  View → GitHub   │
└──────────────────┘ └──────────────────┘
```

- Main projects with pin containers
- Tech stack icons
- GitHub links

### 6. **Technical Projects Section** 💻

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Project 1   │ │ Project 2   │ │ Project 3   │
├─────────────┤ ├─────────────┤ ├─────────────┤
│ Project 4   │ │ Project 5   │ │ Project 6   │
└─────────────┘ └─────────────┘ └─────────────┘
```

- 6 technical projects
- 3-column grid layout
- GitHub + Live demo buttons

### 7. **Achievements Section** 🏆

- Infinite scrolling achievements
- Competition recognitions
- Tech stack logos showcase

### 8. **Certifications Section** 📜

```
┌───────────────────────┐ ┌───────────────────────┐
│ Certification 1       │ │ Certification 2       │
│ Issuer + Date + Link  │ │ Issuer + Date + Link  │
└───────────────────────┘ └───────────────────────┘
```

- Professional credentials
- Issuer information
- Dates and credential links

### 9. **Experience & Leadership Section** 📊

**Technical Experience:**

```
┌─────────────┬─────────────┬─────────────┬──────────────┐
│ Frontend    │  Backend    │   ML/DL     │ Competitive  │
└─────────────┴─────────────┴─────────────┴──────────────┘
```

**Leadership Roles:**

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Web Dev Lead   │ │ Coding Mentor  │ │ Coordinator    │
│ Exodia'25      │ │ IIT Mandi      │ │ Research Soc   │
└────────────────┘ └────────────────┘ └────────────────┘
```

### 10. **Social Engagements Section** 👥

```
┌──────────────────┐ ┌──────────────────┐
│ Club 1           │ │ Club 2           │
│ Role + Duration  │ │ Role + Duration  │
└──────────────────┘ └──────────────────┘
```

- Clubs and societies
- Volunteering activities
- Interests and involvement
- Color-coded by type

### 11. **Contact Section** 📞

```
┌──────────┬──────────┬──────────┬──────────┐
│ GitHub   │ LinkedIn │ Twitter  │ Email    │
└──────────┴──────────┴──────────┴──────────┘

[Get In Touch CTA Button]
```

- Social media links
- Email contact
- Call-to-action button

### 12. **Footer** 👣

- Additional navigation
- Social links
- Copyright info

---

## 🎯 Key Features

### Responsive Design

- **Mobile:** 1-column layouts with touch-friendly spacing
- **Tablet:** 2-column layouts with adjusted sizing
- **Desktop:** Full 3-4 column layouts with maximum space

### Interactive Elements

- ✨ Hover effects on all cards
- 🔄 Smooth transitions and animations
- 🎨 Gradient overlays
- 💫 Border animations

### Color Scheme

- Primary: Purple (`#CBACF9`, `#7c3aed`)
- Accent: Blue (`#3b82f6`, `#1e40af`)
- Background: Dark (`#000000`, `#1a1a2e`)
- Text: Light (`#ffffff`, `#e0e0e0`)

### Typography

- Headings: Bold, large sizes
- Descriptions: Medium weight, readable size
- Labels: Smaller, uppercase, semibold

---

## 🔗 Navigation Mapping

| Navbar Item    | Section ID      | Component                   | Purpose                 |
| -------------- | --------------- | --------------------------- | ----------------------- |
| About Me       | #about          | AboutMe.tsx                 | Personal introduction   |
| Skills         | #skills         | Skills.tsx                  | Technical capabilities  |
| Projects       | #projects       | FeaturedProjects.tsx        | Main portfolio projects |
| Achievements   | #achievements   | Achievements.tsx            | Competitions & awards   |
| Certifications | #certifications | Certifications.tsx          | Credentials             |
| Experience     | #experience     | ExperienceAndLeadership.tsx | Work & leadership       |
| Contact        | #contact        | Contact.tsx                 | Get in touch            |

---

## 📊 Component Hierarchy

```
Home (page.tsx)
├── FloatingNav
├── Hero
├── AboutMe
├── Skills
├── CoreExpertise
├── FeaturedProjects
├── TechnicalProjects
├── Achievements
├── Certifications
├── ExperienceAndLeadership
│   ├── Work Experience Cards
│   └── Leadership Roles Cards
├── SocialEngagements
├── Contact
└── Footer
```

---

## 🎨 Design Patterns

### Card Pattern

All content cards follow this pattern:

```tsx
<div className="rounded-xl bg-gradient-to-br from-slate-900 to-black-100 p-6 border border-purple-500/20 hover:border-purple-500/60 transition-all">
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-xl transition-all" />
  {/* Content */}
  <div className="relative z-10">{/* Content */}</div>
</div>
```

### Grid Pattern

- Responsive grid layouts using Tailwind CSS
- Mobile-first approach (1 col → scales up)
- Consistent gap spacing

### Animation Pattern

- Smooth transitions on all interactive elements
- Hover scale and glow effects
- Border animation on hover

---

## 📝 Data Sources

| Component          | Data Source                                    |
| ------------------ | ---------------------------------------------- |
| Grid items         | `data/index.ts` (gridItems)                    |
| Skills             | Defined in component                           |
| Core Expertise     | `public/data/core_expertise_data/index.ts`     |
| Featured Projects  | `data/index.ts` (projects)                     |
| Technical Projects | Defined in component (sample data)             |
| Achievements       | `data/index.ts` (achievements)                 |
| Certifications     | `public/data/certifications_data/index.ts`     |
| Work Experience    | `data/index.ts` (workExperience)               |
| Leadership         | Defined in component                           |
| Social Engagements | `public/data/social_engagements_data/index.ts` |
| Navigation         | `public/data/nav_data/index.ts`                |

---

Your portfolio is now a comprehensive, professional showcase of your skills, projects, and experience! 🚀
