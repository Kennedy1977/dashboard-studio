# Orbit design system notes

This dashboard combines three design-engineering approaches:

- Taste: establish a distinct visual direction before adding more UI. Orbit uses a calm analytical canvas, a violet signal colour and restrained mint/coral status colours.
- Impeccable: keep hierarchy, spacing, focus states, responsive behavior and edge cases explicit. Each widget has a title, state, action area and independent data boundary.
- Emil Kowalski: use motion to explain state changes. Charts draw when they enter view, progress bars reveal their value, and hover feedback stays short and subtle.

## Motion rules

Use transform and opacity where possible. Enter with ease-out. Avoid animating every card on initial load; reveal content as it becomes relevant. Always respect `prefers-reduced-motion`.

## Component rules

1. Give every widget a clear title and a useful secondary label.
2. Keep controls close to the data they change.
3. Use colour for status and emphasis, not as the only way to communicate meaning.
4. Preserve visible focus states and native keyboard behavior.
5. Test long labels, empty data, errors, narrow screens and large numbers.
