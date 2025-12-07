import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * Server errors returned from Server Actions.
 * Field names map to error messages. Use '_form' key for form-level errors.
 */
type ServerErrors = Record<string, string>;

/**
 * Sets server errors in React Hook Form.
 * Maps field errors to form fields and form-level errors to the root error.
 *
 * @param setError - React Hook Form's `setError` function
 * @param errors - Server errors object (field name -> error message, use '_form' for form-level errors)
 *
 * @example
 * ```ts
 * if (!result.success) {
 *   setServerErrors(form.setError, result.errors);
 * }
 * ```
 */
export function setServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: ServerErrors,
): void {
  const { _form, ...fieldErrors } = errors;

  // Set form-level error using React Hook Form's root error
  // 'root' is a special field name supported by React Hook Form but not in the FieldPath type
  if (_form) {
    setError('root' as FieldPath<T>, {
      type: 'server',
      message: _form,
    });
  }

  // Set all field-level errors
  // Field names from server may not match form fields exactly, but React Hook Form handles this gracefully
  for (const [field, message] of Object.entries(fieldErrors)) {
    setError(field as FieldPath<T>, {
      type: 'server',
      message,
    });
  }
}
