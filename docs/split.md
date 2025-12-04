## Core Splitting Principles

### Separation of Concerns Strategy
- **UI Layer**: Extract presentational components that are purely visual and stateless
- **Logic Layer**: Extract business logic, state management, and side effects into custom hooks
- **Data Layer**: Separate type definitions, constants, and utility functions into dedicated files
- **Folder Structure**: Organize files using "folder-as-component" pattern for clear navigation

### UI Component Extraction
- Identify independent visual blocks in JSX (search bars, tables, modals, lists)
- Create stateless functional components that only receive props and callbacks
- Ensure components have single responsibility and clear interfaces
- Use descriptive names that indicate component purpose (SearchBar, UserList, EditModal)
- Pass data and handlers through props, avoid prop drilling when possible

### Custom Hook Creation
- Extract useState, useEffect, and event handlers when they dominate component size
- Create use[FeatureName] hooks that encapsulate feature-specific logic
- Return only the data and methods that UI components need
- Handle data fetching, state transformations, and business rules in hooks
- Keep hooks focused on single features to maintain reusability

### Data Organization
- Move TypeScript interfaces and types to dedicated types.ts or interfaces.ts files
- Extract constants (API endpoints, form configurations, dropdown options) to constants.ts
- Move pure utility functions (date formatting, data transformations) to utils.ts
- Ensure all extracted files are properly imported and maintain type safety
- Use barrel exports (index.ts) for cleaner import paths

## Systematic Refactoring Process

### Step 1: Data Extraction
- Scan component file for interface/type definitions at the top
- Extract all constants and configuration objects
- Move utility functions that don't depend on component state
- Update imports and verify TypeScript compilation

### Step 2: UI Component Splitting
- Analyze JSX structure to identify independent visual sections
- Extract each section into separate component files
- Define clear prop interfaces for each new component
- Replace original JSX with component references
- Ensure proper prop passing and callback handling

### Step 3: Logic Extraction
- Identify stateful logic that can be isolated from UI
- Create custom hooks that encapsulate feature logic
- Move API calls, state management, and complex calculations to hooks
- Return necessary data and methods for UI consumption
- Keep hooks focused and composable

### Step 4: Integration and Testing
- Verify all imports and dependencies are correctly resolved
- Ensure component hierarchy maintains proper data flow
- Check that extracted components remain functional
- Validate TypeScript types throughout the refactored structure
- Test component behavior after each extraction step

## Directory Structure Guidelines

### Recommended Pattern
```
UserManagement/
├── index.ts              # Barrel export
├── UserManagement.tsx    # Main container component
├── components/           # UI components
│   ├── SearchBar.tsx
│   ├── UserList.tsx
│   └── EditModal.tsx
├── hooks/               # Custom hooks
│   └── useUserManagement.ts
├── types/               # Type definitions
│   └── user.types.ts
├── constants/           # Constants and configs
│   └── user.constants.ts
└── utils/              # Utility functions
    └── user.utils.ts
```

## Quality Assurance

### Component Validation
- Ensure extracted components remain pure and side-effect free
- Verify props interfaces are complete and accurate
- Check for proper error handling and loading states
- Confirm accessibility standards are maintained
- Validate component reusability across different contexts

### Hook Validation
- Ensure hooks don't contain UI-specific code
- Verify return values are memoized when appropriate
- Check for proper cleanup in useEffect hooks
- Validate error handling and edge cases
- Ensure hooks are testable and well-documented

### Code Quality Standards
- Maintain consistent naming conventions throughout
- Ensure proper TypeScript typing without any implicit any
- Keep file sizes reasonable (aim for <200 lines per file)
- Document complex logic and business rules
- Follow established project coding standards and patterns

## Common Patterns and Anti-patterns

### Recommended Patterns
- Container/Presentational component separation
- Custom hooks for feature-specific logic
- Barrel exports for clean module interfaces
- Consistent file naming and organization
- Progressive enhancement approach

### Avoid These Anti-patterns
- Over-splitting components into too-small pieces
- Creating hooks with mixed concerns
- Prop drilling through multiple levels
- Duplicating logic across components