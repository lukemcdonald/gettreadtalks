# Error Service

Centralized error handling and reporting for the application.

## Features

- **Breadcrumbs** - Track events leading to errors
- **Context vs Extras** - Organized data sections in Sentry UI
- **Fingerprinting** - Custom error grouping in Sentry
- **Tags** - Categorize and filter errors
- **Transaction Names** - Better error organization
- **User Context** - Associate errors with users

## Usage

### Basic Error Capture

```typescript
import { captureException } from '@/lib/services/errors';

try {
  await riskyOperation();
} catch (error) {
  captureException(error);
}
```

### With Context and Tags

```typescript
captureException(error, {
  context: {
    operation: 'createItem',
    itemId: item._id,
  },
  level: 'warning',
  tags: {
    feature: 'items',
    operation: 'create',
  },
});
```

### With Fingerprinting (Custom Grouping)

Group related errors together regardless of stack trace:

```typescript
captureException(error, {
  fingerprint: ['items', 'validation', 'duplicate-slug'],
  tags: { feature: 'items' },
});
```

**When to use fingerprinting:**

- Group all validation errors together: `['validation', field]`
- Group by feature: `['items', errorType]`
- Group by operation: `['items', 'create', errorType]`

### With Transaction Name

Organize errors by logical operations:

```typescript
captureException(error, {
  transactionName: 'items:create',
  tags: { feature: 'items' },
});
```

### With Custom Extras

Use the explicit `extras` property for additional unstructured data:

```typescript
captureException(error, {
  tags: { feature: 'items' },
  extras: {
    itemId: item._id,
    itemTitle: item.title,
    attemptNumber: 3,
  },
});
```

### Complete Example

```typescript
import { captureException, setUserContext } from '@/lib/services/errors';

// Set user context when user logs in
setUserContext({
  id: user._id,
  email: user.email,
  username: user.name,
});

// Capture error with full context
try {
  await createItem(data);
} catch (error) {
  captureException(error, {
    // Control error grouping
    fingerprint: ['items', 'create', 'validation'],

    // Organize by operation
    transactionName: 'items:create',

    // Categorize for filtering
    tags: {
      feature: 'items',
      operation: 'create',
      error_category: 'validation',
    },

    // Set severity
    level: 'warning',

    // Add structured context (appears in Context section)
    context: {
      operation: 'createItem',
      slug: data.slug,
    },

    // Add extra data (appears in Extra Data section)
    extras: {
      itemTitle: data.title,
      userId: data.userId,
    },
  });
}
```

## User Context

### Setting User Context

Call when user logs in:

```typescript
import { setUserContext } from '@/lib/services/errors';

setUserContext({
  id: user._id,
  email: user.email,
  username: user.name,
});
```

### Clearing User Context

Call when user logs out:

```typescript
import { clearUserContext } from '@/lib/services/errors';

clearUserContext();
```

## Context vs Extras: When to Use Each

Sentry displays `context` and `extras` in separate sections. Choose based on data structure and
purpose:

### Use `context` for:

- **Structured, domain-specific data**
- Data that's related to the operation/feature
- Information that helps understand what the code was doing
- Data you want grouped logically in the UI

```typescript
captureException(error, {
  context: {
    operation: 'createItem',
    slug: 'my-item-slug',
    status: 'draft',
    userId: 'user-123',
  },
});
```

### Use `extras` for:

- **Unstructured or miscellaneous data**
- Technical debugging information
- IDs, timestamps, attempt numbers
- Data that doesn't fit into a specific domain

```typescript
captureException(error, {
  extras: {
    itemId: item._id,
    attemptNumber: 3,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  },
});
```

### Visual Difference in Sentry:

**Context** appears in its own section with nice formatting:

```
Context > error_context
  operation: createItem
  slug: my-item-slug
  userId: user-123
```

**Extras** appears in a separate "Additional Data" section:

```
Extra Data
  itemId: abc123
  attemptNumber: 3
  timestamp: 1234567890
```

### Best Practice: Use Both

Combine them for comprehensive debugging:

```typescript
captureException(error, {
  // Domain context - what operation failed
  context: {
    operation: 'createItem',
    slug: data.slug,
  },
  // Additional details for debugging
  extras: {
    itemId: item._id,
    attemptNumber: retryCount,
  },
  // Categorization
  tags: {
    feature: 'items',
    operation: 'create',
  },
});
```

## Breadcrumbs

Add breadcrumbs to track events leading to errors:

```typescript
import { addBreadcrumb } from '@/lib/services/errors';

addBreadcrumb({
  message: 'User clicked create item button',
  category: 'user-action',
  level: 'info',
  data: {
    formData: { title: 'My item' },
  },
});
```

## Severity Levels

Available severity levels (most to least severe):

- `fatal` - Critical errors that crash the app
- `error` - Errors that should be fixed (default)
- `warning` - Warnings that should be investigated
- `log` - General logging
- `info` - Informational messages
- `debug` - Debug information

## Best Practices

### 1. Use Fingerprinting for Related Errors

Group related errors for better issue management:

```typescript
// All duplicate slug errors grouped together
captureException(error, {
  fingerprint: ['validation', 'duplicate-slug'],
  tags: { error_category: 'validation' },
});
```

### 2. Add Transaction Names for Operations

Helps identify which operation failed:

```typescript
captureException(error, {
  transactionName: 'items:create',
  tags: { feature: 'items', operation: 'create' },
});
```

### 3. Tag by Feature for Filtering

Makes it easy to filter errors in Sentry:

```typescript
captureException(error, {
  tags: {
    feature: 'items',
    operation: 'create',
    error_category: 'validation',
  },
});
```

### 4. Use Context vs Extras Appropriately

**Context** - For structured, domain-specific data:

```typescript
captureException(error, {
  context: {
    operation: 'createItem',
    slug: item.slug,
    userId: item.userId,
  },
});
```

**Extras** - For additional unstructured data:

```typescript
captureException(error, {
  context: { operation: 'createItem' },
  extras: {
    itemId: item._id,
    attemptNumber: retryCount,
    timestamp: Date.now(),
  },
});
```

### 5. Set Appropriate Severity Levels

```typescript
// Warning for expected errors
captureException(error, {
  level: 'warning',
  tags: { error_category: 'validation' },
});

// Error for unexpected failures
captureException(error, {
  level: 'error',
  tags: { error_category: 'database' },
});

// Fatal for critical failures
captureException(error, {
  level: 'fatal',
  tags: { error_category: 'auth' },
});
```

## Sentry Dashboard Queries

With proper tagging, you can create powerful filters:

- **All items errors:** `feature:items`
- **Validation errors:** `error_category:validation`
- **Create operations:** `operation:create`
- **Specific user:** `user.id:user123`
- **Combined:** `feature:items AND operation:create AND error_category:validation`

## Error Codes

Use predefined error codes for consistency:

```typescript
import { ErrorCode } from '@/lib/services/errors';

// In your code
if (!user) {
  throw new Error('User not found', {
    code: ErrorCode.NOT_FOUND,
  });
}
```

Available error codes:

- `AUTH_REQUIRED` - User must be authenticated
- `FORBIDDEN` - User lacks permission
- `INVALID_CREDENTIALS` - Login credentials invalid
- `DUPLICATE_SLUG` - Slug already exists
- `VALIDATION_FAILED` - Input validation failed
- `NOT_FOUND` - Resource not found
- `DATABASE_ERROR` - Database operation failed
- `NETWORK_ERROR` - Network request failed
- `SERVER_ERROR` - Internal server error

## Frontend vs Backend

This error service is for **frontend** errors. For backend (Convex) errors, use the Convex Sentry
integration which automatically sends tags like `func`, `func_type`, `environment`, etc.

### Tag Consistency

Keep tags consistent between frontend and backend:

**Frontend:**

```typescript
captureException(error, {
  tags: {
    service: 'frontend',
    platform: 'nextjs',
    feature: 'items',
  },
});
```

**Backend (Convex):** Convex automatically sends: `service: backend`, `platform: convex`,
`func: items:create`
