# Design System Configuration

This directory contains the centralized design system configuration for the Learning Management application.

## Files

### `colors.ts`

Centralized color palette configuration with:

- **Color Scales**: Primary, Slate, Success, Warning, Danger (50-950 shades)
- **Semantic Colors**: Status colors, difficulty levels, provider colors, rarity colors
- **Gradients**: Predefined gradient combinations for consistent styling
- **TypeScript Types**: Type-safe color usage throughout the application

#### Usage Example

```typescript
import { colors, semanticColors, gradients } from "@/config/colors";

// Use color scales
const primaryColor = colors.primary[600];

// Use semantic colors
const difficultyColor = semanticColors.difficulty.beginner;

// Use gradients
const heroGradient = gradients.hero;
```

### `theme.ts`

Design tokens and theme settings including:

- **Spacing**: Consistent spacing scale (xs to 4xl)
- **Typography**: Font families, sizes, weights, line heights
- **Border Radius**: Standardized border radius values
- **Shadows**: Shadow definitions including glow effects
- **Animations**: Duration and easing configurations
- **Breakpoints**: Responsive design breakpoints
- **Z-Index**: Layering scale for components
- **Component Sizes**: Size variants for buttons, inputs, badges
- **Icon Sizes**: Standardized icon dimensions

#### Usage Example

```typescript
import { spacing, typography, shadows } from "@/config/theme";

// Use spacing
const padding = spacing.lg; // 24px

// Use typography
const fontSize = typography.fontSize["2xl"]; // 1.5rem

// Use shadows
const boxShadow = shadows.glow;
```

## Integration with Tailwind

The color configuration is automatically imported into `tailwind.config.js`:

```javascript
import { colors } from "./src/config/colors";

export default {
  theme: {
    extend: {
      colors, // All colors available as Tailwind utilities
    },
  },
};
```

This means you can use all colors directly in your className strings:

```tsx
<div className="bg-primary-600 text-white">
  <p className="text-success-500">Success message</p>
</div>
```

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Import from config files** for type safety
3. **Use semantic color names** when available (e.g., `semanticColors.difficulty.beginner`)
4. **Leverage TypeScript types** for autocomplete and type checking
5. **Update this README** when adding new tokens or configurations

## Adding New Colors

To add a new color:

1. Add the color scale to `colors.ts`:

```typescript
export const colors = {
  // ... existing colors
  newColor: {
    50: "#...",
    // ... other shades
    900: "#...",
  },
};
```

2. The color will automatically be available in Tailwind and TypeScript

## Adding New Design Tokens

To add new design tokens:

1. Add them to the appropriate section in `theme.ts`
2. Export TypeScript types if needed
3. Document usage in this README
