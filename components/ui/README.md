# UI Components

A collection of reusable UI components built with Tailwind Variants and semantic color system.

## Components

- **Badge** - Status and category badges
- **Button** - Interactive button with variants
- **Card** - Container with header, content, and footer
- **Heading** - Semantic heading elements with consistent sizing
- **Input** - Form input with validation states
- **Text** - Typography component for body text

## Usage

```tsx
import { 
  Badge, 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Heading,
  Input,
  Text 
} from '@/components/ui';

// Typography
<Heading as="h1" size="4xl" weight="bold">Page Title</Heading>
<Heading as="h2" size="2xl">Section Title</Heading>
<Text size="lg" weight="medium">Large body text</Text>
<Text size="sm" color="neutral">Small muted text</Text>

// Button variants
<Button variant="primary" size="lg">Primary Button</Button>
<Button variant="secondary" size="md">Secondary</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="error">Delete</Button>

// Card composition
<Card variant="elevated" padding="lg">
  <CardHeader>
    <Heading as="h3" size="xl">Card Title</Heading>
  </CardHeader>
  <CardContent>
    <Text>Card content goes here</Text>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>

// Input states
<Input placeholder="Enter text" />
<Input variant="error" placeholder="Invalid input" />
<Input variant="success" placeholder="Valid input" />
<Input variant="info" placeholder="Info input" />

// Badges
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Closed</Badge>
<Badge variant="info" size="sm">Info</Badge>
```

## Semantic Color System

All components use semantic color names that automatically adapt to light/dark mode:

### Brand Colors
- `primary` - Main brand color
- `secondary` - Secondary brand color
- `accent` - Accent brand color

### Neutrals
- `base-100`, `base-200`, `base-300` - Surface colors
- `neutral` - Non-saturated UI elements

### Status Colors
- `info` - Informative messages
- `success` - Success states
- `warning` - Warning states
- `error` - Error/destructive states

## Customizing

All components use Tailwind Variants, so you can extend them or override styles:

```tsx
import { Button } from '@/components/ui';

// Custom className
<Button className="custom-class">Custom Button</Button>

// Multiple variants
<Button variant="primary" size="lg">Large Primary</Button>
```

## Theming

Colors are defined as CSS variables in `app/globals.css` using the OKLCH color space for better color perception. To customize:

1. Modify the CSS variables in `app/globals.css`
2. Colors automatically adapt to light/dark mode
3. All components inherit the theme
