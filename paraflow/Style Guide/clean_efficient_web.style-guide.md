# Clean Efficient Enterprise Web Style Guide

**Style Overview**:
An ultra-clean flat design for an enterprise AI data platform, featuring soft natural green as the primary color with pure white backgrounds for maximum readability. Uses subtle surface color variations instead of shadows or borders to create visual hierarchy, complemented by a restrained low-saturation Morandian palette (dusty teal and warm beige accents) for a fresh, natural, and comfortable data-intensive work environment.

## Colors
### Primary Colors
  - **primary-base**: `text-[#7BA886]` or `bg-[#7BA886]`
  - **primary-lighter**: `bg-[#A3C4AC]`
  - **primary-darker**: `text-[#5E8A6A]` or `bg-[#5E8A6A]`

### Background Colors

#### Structural Backgrounds

Choose based on layout type:

**For Vertical Layout** (Top Header + Optional Side Panels):
- **bg-nav-primary**: `bg-[hsla(142, 18%, 94%, 1)]` - Top header
- **bg-nav-secondary**: `bg-[hsla(142, 20%, 97%, 1)]` - Inner Left sidebar (if present)
- **bg-page**: `bg-white` - Page background (bg of Main Content area)

**For Horizontal Layout** (Side Navigation + Optional Top Bar):
- **bg-nav-primary**: `bg-[hsla(142, 18%, 94%, 1)]` - Left main sidebar
- **bg-nav-secondary**: `bg-[hsla(142, 20%, 97%, 1)]` - Inner Top header (if present)
- **bg-page**: `bg-white` - Page background (bg of Main Content area)

#### Container Backgrounds
For main content area. Adjust values when used on navigation backgrounds to ensure sufficient contrast.
- **bg-container-primary**: `bg-[hsla(142, 25%, 98%, 1)]`
- **bg-container-secondary**: `bg-[hsla(142, 15%, 96%, 1)]`
- **bg-container-inset**: `bg-[hsla(142, 22%, 92%, 1)]`
- **bg-container-inset-strong**: `bg-[hsla(142, 18%, 88%, 1)]`

### Text Colors
- **color-text-primary**: `text-[hsla(0, 0%, 15%, 1)]`
- **color-text-secondary**: `text-[hsla(0, 0%, 35%, 1)]`
- **color-text-tertiary**: `text-[hsla(0, 0%, 55%, 1)]`
- **color-text-quaternary**: `text-[hsla(0, 0%, 75%, 1)]`
- **color-text-link**: `text-[#7BA886]` - Links, text-only buttons without backgrounds, and clickable text in tables

### Functional Colors
Use **sparingly** to maintain a minimalist and neutral overall style. Used for the surfaces of text-only cards, simple cards, buttons, and tags.
  - **color-success-default**: `#B8D9C4`
  - **color-success-light**: `#E5F2E9` - tag/label bg
  - **color-error-default**: `#D8ADA6`
  - **color-error-light**: `#F5E5E3` - tag/label bg
  - **color-warning-default**: `#E8D5B8`
  - **color-warning-light**: `#F7F0E5` - tag/label bg
  - **color-function-default**: `#6B8FA3`
  - **color-function-light**: `#D9E8EF` - tag/label bg

### Accent Colors
  - A secondary palette for occasional highlights and categorization. **Avoid overuse** to protect brand identity. Use **sparingly**.
  - **accent-teal-dust**: `text-[#8BA49A]` or `bg-[#8BA49A]`
  - **accent-beige-warm**: `text-[#C4B5A0]` or `bg-[#C4B5A0]`

### Data Visualization Charts
For data visualization charts only.
  - Standard data colors: `#7BA886`, `#8BA49A`, `#A3C4AC`, `#C4B5A0`, `#D8ADA6`, `#6B8FA3`
  - Secondary palette: `#E8E8E8`, `#C8C8C8`, `#A0A0A0`, `#707070`, `#484848`

## Typography
- **Font Stack**:
  - **font-family-base**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` — For regular UI copy

- **Font Size & Weight**:
  - **Caption**: `text-sm font-normal`
  - **Body**: `text-base font-normal`
  - **Body Emphasized**: `text-base font-semibold`
  - **Card Title / Subtitle**: `text-lg font-semibold`
  - **Page Title**: `text-xl font-semibold`
  - **Headline**: `text-3xl font-semibold`

- **Line Height**: 1.6

## Border Radius
  - **Small**: 8px — Elements inside cards (e.g., photos, avatars)
  - **Medium**: 12px — Buttons, inputs, tags
  - **Large**: 16px — Cards, containers
  - **Full**: full — Toggles, small badges

## Layout & Spacing
  - **Tight**: 8px - For closely related small internal elements, such as icons and text within buttons
  - **Compact**: 16px - For small gaps between small containers, such as a line of tags
  - **Standard**: 24px - For gaps between medium containers like list items, table rows
  - **Relaxed**: 32px - For gaps between large containers and sections
  - **Section**: 48px - For major section divisions

## Create Boundaries (contrast of surface color, borders, shadows)
No borders or dividers. Primarily relying on subtle surface color contrast to create boundaries and visual hierarchy. This maintains the ultra-clean flat aesthetic ideal for data-intensive enterprise interfaces.

### Borders
  - **Case 1**: No borders for most elements.
  - **Case 2**: If needed for data tables or input fields
    - **Default**: 1px solid `hsla(142, 15%, 88%, 1)`. Used for table cells, form inputs. `border border-[hsla(142,15%,88%,1)]`
    - **Stronger**: 1px solid `hsla(142, 18%, 82%, 1)`. Used for active or focused states. `border border-[hsla(142,18%,82%,1)]`

### Dividers
  - **Case 1**: No dividers for most layouts.
  - **Case 2**: If needed for data tables, use `border-t` or `border-b` `border-[hsla(142,15%,90%,1)]`.

### Shadows & Effects
  - **Case 1**: No shadow - maintaining pure flat design aesthetic.

## Visual Emphasis for Containers
When containers (tags, cards, list items, rows) need visual emphasis to indicate priority, status, or category, use the following techniques:

| Technique | Implementation Notes | Best For | Avoid |
|-----------|---------------------|----------|-------|
| Background Tint | Slightly darker/lighter color or reduce transparency of backgrounds | Gentle, common approach for moderate emphasis needs | Heavy colors on large areas (e.g., red background for entire large cards) |
| Border Highlight | Use thin border with opacity for subtlety | Active/selected states, form validation | - |
| Status Tag/Label | Add colored tag/label inside container | Larger containers | - |
| Side Accent Bar | **Left edge only**, for **non-rounded containers** | Small non-rounded list items (e.g., side nav tabs), small non-rounded cards (e.g., task cards) | Large cards, wide list items, rounded containers |

## Assets
### Image

- For normal `<img>`: object-cover
- For `<img>` with:
  - Slight overlay: object-cover brightness-90
  - Heavy overlay: object-cover brightness-75

### Icon

- Use Lucide icons from Iconify.
- To ensure an aesthetic layout, each icon should be centered in a square container, typically without a background, matching the icon's size.
- Use Tailwind font size to control icon size
- Example:
  ```html
  <div class="flex items-center justify-center bg-transparent w-5 h-5">
  <iconify-icon icon="lucide:database" class="text-base"></iconify-icon>
  </div>
  ```

### Third-Party Brand Logos:
   - Use Brand Icons from Iconify.
   - Logo Example:
     Monochrome Logo: `<iconify-icon icon="simple-icons:x"></iconify-icon>`
     Colored Logo: `<iconify-icon icon="logos:google-icon"></iconify-icon>`

### User's Own Logo:
- To protect copyright, do **NOT** use real product logos as a logo for a new product, individual user, or other company products.
- **Icon-based**:
  - **Graphic**: Use a simple, relevant icon (e.g., a `database` icon for a data platform, a `brain-circuit` icon for an AI platform).

## Page Layout - Web (*EXTREMELY* important)
### Determine Layout Type
- Choose between Vertical or Horizontal layout based on whether the primary navigation is a full-width top header or a full-height sidebar (left/right).
- User requirements typically indicate the layout preference. If unclear, consider:
  - Marketing/content sites typically use Vertical Layout.
  - Functional/dashboard sites can use either, depending on visual style. Sidebars accommodate more complex navigation than top bars. For complex navigation needs with a preference for minimal chrome (Vertical Layout adds an extra fixed header), choose Horizontal Layout (omits the fixed top header).
- Vertical Layout Diagram:
┌──────────────────────────────────────────────────────┐
│  Header (Primary Nav)                                │
├──────────┬──────────────────────────────┬────────────┤
│Left      │ Sub-header (Tertiary Nav)    │ Right      │
│Sidebar   │ (optional)                   │ Sidebar    │
│(Secondary├──────────────────────────────┤ (Utility   │
│Nav)      │ Main Content                 │ Panel)     │
│(optional)│                              │ (optional) │
│          │                              │            │
└──────────┴──────────────────────────────┴────────────┘
- Horizontal Layout Diagram:
┌──────────┬──────────────────────────────┬───────────┐
│          │ Header (Secondary Nav)       │           │
│ Left     │ (optional)                   │ Right     │
│ Sidebar  ├──────────────────────────────┤ Sidebar   │
│ (Primary │ Main Content                 │ (Utility  │
│ Nav)     │                              │ Panel)    │
│          │                              │ (optional)│
│          │                              │           │
└──────────┴──────────────────────────────┴───────────┘
### Detailed Layout Code
**Vertical Layout**
```html
<!-- Body: Adjust width (w-[1440px]) based on target screen size -->
<body class="w-[1440px] min-h-[900px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] leading-[1.6]">

  <!-- Header (Primary Nav): Fixed height -->
  <header class="w-full">
    <!-- Header content -->
  </header>

  <!-- Content Container: Must include 'flex' class -->
  <div class="w-full flex min-h-[900px]">
    <!-- Left Sidebar (Secondary Nav) (Optional): Remove if not needed. If Left Sidebar exists, use its ml to control left page margin -->
    <aside class="flex-shrink-0 min-w-fit">

    </aside>

    <!-- Main Content Area:
     Use Main Content Area's horizontal padding (px) to control distance from main content to sidebars or page edges.
     For pages without sidebars (like Marketing Pages, simple content pages such as help centers, privacy policies) use larger values (px-30 to px-80), for pages with sidebars (Functional/Dashboard Pages, complex content pages with multi-level navigation like knowledge base articles) use moderate values (px-8 to px-16) -->
    <main class="flex-1 overflow-x-hidden flex flex-col">
    <!--  Main Content -->

    </main>

    <!-- Right Sidebar (Utility Panel) (Optional): Remove if not needed. If Right Sidebar exists, use its mr to control right page margin -->
    <aside class="flex-shrink-0 min-w-fit">
    </aside>

  </div>
</body>
```

**Horizontal Layout**

```html
<!-- Body: Adjust width (w-[1440px]) based on target screen size. Must include 'flex' class -->
<body class="w-[1440px] min-h-[900px] flex font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] leading-[1.6]">

<!-- Left Sidebar (Primary Nav): Use its ml to control left page margin -->
  <aside class="flex-shrink-0 min-w-fit">
  </aside>

  <!-- Content Container-->
  <div class="flex-1 overflow-x-hidden flex flex-col min-h-[900px]">

    <!-- Header (Secondary Nav) (Optional): Remove if not needed. If Header exists, use its mx to control distance to left/right sidebars or page margins -->
    <header class="w-full">
    </header>

    <!-- Main Content Area: Use Main Content Area's pl to control distance from main content to left sidebar. Use pr to control distance to right sidebar/right page edge -->
    <main class="w-full">
    </main>


  </div>

  <!-- Right Sidebar (Utility Panel) (Optional): Remove if not needed. If Right Sidebar exists, use its mr to control right page margin -->
  <aside class="flex-shrink-0 min-w-fit">
  </aside>

</body>
```

## Tailwind Component Examples (Key attributes)
**Important Note**: Use utility classes directly. Do NOT create custom CSS classes or add styles in <style> tags for the following components

### Basic

- **Button**: (Note: Use flex and items-center for the container)
  - Example 1 (Primary filled button):
    - button: flex items-center gap-2 bg-[#7BA886] text-white hover:bg-[#5E8A6A] transition px-6 py-2.5 rounded-xl
      - icon (optional)
      - span(button copy): whitespace-nowrap
  - Example 2 (Secondary text button):
    - button: flex items-center gap-2 text-[#7BA886] hover:opacity-70 transition
      - icon (optional)
      - span(button copy): whitespace-nowrap
  - Example 3 (icon button):
    - button: flex items-center justify-center w-10 h-10 rounded-xl bg-[hsla(142,25%,98%,1)] hover:bg-[hsla(142,22%,92%,1)] transition
      - icon

- **Tag Group (Filter Tags)** (Note: `overflow-x-auto` and `whitespace-nowrap` are required)
  - container(scrollable): flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden
    - label (Tag item 1):
      - input: type="radio" name="tag1" class="sr-only peer" checked
      - div: bg-[hsla(142,25%,98%,1)] text-[hsla(0,0%,35%,1)] peer-checked:bg-[#A3C4AC] peer-checked:text-[hsla(0,0%,15%,1)] hover:opacity-80 transition whitespace-nowrap px-4 py-2 rounded-xl cursor-pointer

### Data Entry
- **Progress bars/Slider**: h-2 bg-[hsla(142,22%,92%,1)] rounded-full
  - progress fill: h-2 bg-[#7BA886] rounded-full
- **Checkbox**
  - label: flex items-center gap-3 cursor-pointer
    - input: type="checkbox" class="sr-only peer"
    - div: w-5 h-5 bg-[hsla(142,25%,98%,1)] rounded-lg flex items-center justify-center peer-checked:bg-[#7BA886] text-transparent peer-checked:text-white transition
      - svg(Checkmark): stroke="currentColor" stroke-width="3"
    - span(text): text-base
- **Radio button**
  - label: flex items-center gap-3 cursor-pointer
    - input: type="radio" name="option1" class="sr-only peer"
    - div: w-5 h-5 bg-[hsla(142,25%,98%,1)] rounded-full flex items-center justify-center peer-checked:bg-[#7BA886] text-transparent peer-checked:text-white transition
      - svg(dot indicator): fill="currentColor" width="10" height="10"
    - span(text): text-base
- **Switch/Toggle**
  - label: flex items-center gap-3 cursor-pointer
    - div: relative
      - input: type="checkbox" class="sr-only peer"
      - div(Toggle track): w-11 h-6 bg-[hsla(142,22%,92%,1)] peer-checked:bg-[#7BA886] transition rounded-full
      - div(Toggle thumb): absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition
    - span(text): text-base

- **Select/Dropdown**
  - Select container: flex items-center gap-2 bg-[hsla(142,25%,98%,1)] px-4 py-2.5 rounded-xl cursor-pointer hover:bg-[hsla(142,22%,92%,1)] transition
    - text: text-base
    - Dropdown icon(square container): flex items-center justify-center bg-transparent w-5 h-5
      - icon: text-base

### Container
- **Navigation Menu - horizontal**
    - Navigation with sections/grouping:
        - Nav Container: flex items-center justify-between w-full
        - Left Section: flex items-center gap-8
          - Menu Item: flex items-center gap-2 text-base text-[hsla(0,0%,15%,1)] hover:text-[#7BA886] transition cursor-pointer
            - icon (optional): w-5 h-5
            - text
        - Right Section: flex items-center gap-4
          - Menu Item: flex items-center gap-2
          - Notification (if applicable): relative flex items-center justify-center w-10 h-10
            - notification-icon: w-5 h-5
            - badge (if has unread): absolute -top-1 -right-1 w-5 h-5 bg-[#D8ADA6] rounded-full flex items-center justify-center text-xs text-white
              - badge-count
          - Avatar(if applicable): flex items-center gap-3
            - avatar-image: w-9 h-9 rounded-lg object-cover
            - dropdown-icon (if applicable): w-5 h-5

- **Card**
    - Example 1 (Data summary card with metrics):
        - Card: bg-[hsla(142,25%,98%,1)] rounded-2xl flex flex-col p-6 gap-4
        - Header: flex items-center justify-between
          - card-title: text-lg font-semibold text-[hsla(0,0%,15%,1)]
          - icon: w-5 h-5 text-[hsla(0,0%,55%,1)]
        - Metrics area: flex flex-col gap-3
          - metric-value: text-3xl font-semibold text-[hsla(0,0%,15%,1)]
          - metric-label: text-sm text-[hsla(0,0%,55%,1)]
    - Example 2 (List item card for enterprise data):
        - Card: bg-[hsla(142,25%,98%,1)] rounded-2xl flex items-center gap-4 p-5 hover:bg-[hsla(142,22%,92%,1)] transition cursor-pointer
        - Icon/Image: w-12 h-12 rounded-lg bg-white flex items-center justify-center
        - Text area: flex-1 flex flex-col gap-1
          - card-title: text-base font-semibold text-[hsla(0,0%,15%,1)]
          - card-subtitle: text-sm text-[hsla(0,0%,55%,1)]
        - Action: w-5 h-5 text-[hsla(0,0%,75%,1)]
    - Example 3 (Table container card):
        - Card: bg-[hsla(142,25%,98%,1)] rounded-2xl flex flex-col overflow-hidden
        - Header: px-6 py-4 bg-white
          - card-title: text-lg font-semibold
        - Table: w-full
          - Table rows with subtle dividers using `border-t border-[hsla(142,15%,90%,1)]`

## Additional Notes

For enterprise data management platforms, prioritize:
- **Information Density**: Optimize spacing for maximum data display without crowding
- **Scanning Efficiency**: Use consistent alignment and grouping for quick data scanning
- **Status Communication**: Leverage subtle color variations for status indication without distraction
- **Table Design**: Employ minimal styling with strategic use of dividers and alternating row backgrounds when needed
- **Filter & Search**: Make filtering controls easily accessible and visually distinct
- **Responsive Data**: Ensure tables and charts adapt gracefully to different viewport widths

<colors_extraction>
#7BA886
#A3C4AC
#5E8A6A
hsla(142, 18%, 94%, 1)
hsla(142, 20%, 97%, 1)
#FFFFFF
hsla(142, 25%, 98%, 1)
hsla(142, 15%, 96%, 1)
hsla(142, 22%, 92%, 1)
hsla(142, 18%, 88%, 1)
hsla(0, 0%, 15%, 1)
hsla(0, 0%, 35%, 1)
hsla(0, 0%, 55%, 1)
hsla(0, 0%, 75%, 1)
#B8D9C4
#E5F2E9
#D8ADA6
#F5E5E3
#E8D5B8
#F7F0E5
#6B8FA3
#D9E8EF
#8BA49A
#C4B5A0
#E8E8E8
#C8C8C8
#A0A0A0
#707070
#484848
hsla(142, 15%, 88%, 1)
hsla(142, 18%, 82%, 1)
hsla(142, 15%, 90%, 1)
</colors_extraction>
