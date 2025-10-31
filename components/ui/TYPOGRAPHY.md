# Typography Components

Text and Heading components for consistent typography across the application.

## Design Philosophy

These components are intentionally simple with a clean API that matches industry standards (Radix, shadcn). This makes it easy to swap implementations in the future if needed—for example, replacing the internals with Radix Primitives while keeping the same component API.

## Text Component

Body text and labels with consistent sizing and semantic colors.

### Basic Usage

```tsx
import { Text } from '@/components/ui';

<Text>Default body text</Text>
<Text size="sm">Small text</Text>
<Text size="lg" weight="medium">Large medium text</Text>
<Text color="primary">Colored text</Text>
```

### As Different Elements

```tsx
<Text as="p">Paragraph element</Text>
<Text as="span">Inline span (default)</Text>
<Text as="div">Block div</Text>
<Text as="label">Form label</Text>
```

### Sizes

- `xs` - 0.75rem (12px) - Tiny labels, captions
- `sm` - 0.875rem (14px) - Secondary text, helper text
- `base` - 1rem (16px) - Body text (default)
- `lg` - 1.125rem (18px) - Emphasized body text
- `xl` - 1.25rem (20px) - Large body text

### Weights

- `light` - 300
- `normal` - 400 (default)
- `medium` - 500
- `semibold` - 600
- `bold` - 700

### Colors

All semantic colors: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`

## Heading Component

Semantic heading elements with consistent sizing.

### Basic Usage

```tsx
import { Heading } from '@/components/ui';

<Heading as="h1" size="4xl">Page Title</Heading>
<Heading as="h2" size="2xl">Section Title</Heading>
<Heading as="h3" size="xl">Subsection</Heading>
```

### Sizes

- `xl` - 1.25rem (20px) - h6, small headings
- `2xl` - 1.5rem (24px) - h5, h4, section headings (default)
- `3xl` - 1.875rem (30px) - h3, subsection headings
- `4xl` - 2.25rem (36px) - h2, major headings
- `5xl` - 3rem (48px) - h1, page titles

### Weights

- `medium` - 500
- `semibold` - 600
- `bold` - 700 (default)
- `extrabold` - 800

## Real-world Examples

### Article Header

```tsx
<div>
  <Badge variant="primary" size="sm">Tutorial</Badge>
  <Heading as="h1" size="4xl" className="mt-2">
    Getting Started with Tailwind Variants
  </Heading>
  <Text size="lg" color="neutral" className="mt-2">
    Learn how to build type-safe component variants
  </Text>
  <Text size="sm" color="neutral" className="mt-4">
    Published on January 15, 2024 · 5 min read
  </Text>
</div>
```

### Form Field

```tsx
<div>
  <Text as="label" weight="medium" className="block mb-1">
    Email Address
  </Text>
  <Input type="email" placeholder="you@example.com" />
  <Text size="sm" color="neutral" className="mt-1">
    We'll never share your email
  </Text>
</div>
```

### Card with Typography

```tsx
<Card variant="bordered" padding="lg">
  <CardHeader>
    <Heading as="h3" size="xl">Welcome Back</Heading>
    <Text size="sm" color="neutral" className="mt-1">
      Continue where you left off
    </Text>
  </CardHeader>
  <CardContent>
    <Text>Your dashboard shows 12 new updates</Text>
  </CardContent>
  <CardFooter>
    <Button variant="primary">View Updates</Button>
  </CardFooter>
</Card>
```

### Status Message

```tsx
<div className="flex items-start gap-3">
  <Badge variant="success">Success</Badge>
  <div>
    <Text weight="semibold">Profile Updated</Text>
    <Text size="sm" color="neutral" className="mt-1">
      Your changes have been saved successfully
    </Text>
  </div>
</div>
```

## Future-Proofing

The API is designed to match Radix/shadcn conventions, making it easy to swap implementations:

**Today:**
```tsx
<Text size="lg" weight="medium" color="primary">Hello</Text>
```

**Tomorrow (with Radix underneath):**
```tsx
// Same external API, different internal implementation
import { Text as RadixText } from '@radix-ui/themes';

export const Text = ({ size, weight, color, ...props }) => (
  <RadixText size={size} weight={weight} color={color} {...props} />
);
```

Your application code doesn't change—just the component internals.
