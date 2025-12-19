# Modern Tech Web Style Guide

**Style Overview**:
A flat, tech-forward **light theme** with subtle shadows creating gentle elevation, centered on calm sky blue with soft multi-color blur gradient backgrounds, designed for data-intensive enterprise interfaces with clear professionalism and refined sophistication.
Avoid heavy borders, avoid strong shadows, and avoid colors not defined in this style.

## Colors
### Primary Colors
  - **primary-base**: `text-[#4A90E2]` or `bg-[#4A90E2]`
  - **primary-lighter**: `bg-[#7AB3F5]`
  - **primary-darker**: `text-[#2E6DB8]` or `bg-[#2E6DB8]`

### Background Colors

#### Structural Backgrounds

Choose based on layout type:

**For Vertical Layout** (Top Header + Optional Side Panels):
- **bg-nav-primary**: `bg-[hsla(210, 18%, 97%, 1)]` - Top header
- **bg-nav-secondary**: `bg-[hsla(210, 20%, 98%, 1)]` - Inner Left sidebar (if present)
- **bg-page**: `style="background: radial-gradient(ellipse 800px 600px at 20% 30%, hsla(210, 60%, 96%, 0.4) 0%, hsla(210, 60%, 96%, 0) 50%), radial-gradient(ellipse 700px 500px at 80% 70%, hsla(200, 50%, 94%, 0.3) 0%, hsla(200, 50%, 94%, 0) 50%), hsla(210, 15%, 98%, 1);"` - Page background (bg of Main Content area)

**For Horizontal Layout** (Side Navigation + Optional Top Bar):
- **bg-nav-primary**: `bg-[hsla(210, 18%, 97%, 1)]` - Left main sidebar
- **bg-nav-secondary**: `bg-[hsla(210, 20%, 98%, 1)]` - Inner Top header (if present)
- **bg-page**: `style="background: radial-gradient(ellipse 800px 600px at 20% 30%, hsla(210, 60%, 96%, 0.4) 0%, hsla(210, 60%, 96%, 0) 50%), radial-gradient(ellipse 700px 500px at 80% 70%, hsla(200, 50%, 94%, 0.3) 0%, hsla(200, 50%, 94%, 0) 50%), hsla(210, 15%, 98%, 1);"` - Page background (bg of Main Content area)

#### Container Backgrounds
For main content area. Adjust values when used on navigation backgrounds to ensure sufficient contrast.
- **bg-container-primary**: `bg-white`
- **bg-container-secondary**: `bg-[hsla(210, 25%, 99%, 1)]`
- **bg-container-inset**: `bg-[#4A90E2]/5`
- **bg-container-inset-strong**: `bg-[#4A90E2]/10`

### Text Colors
- **color-text-primary**: `text-[hsla(210, 18%, 20%, 1)]`
- **color-text-secondary**: `text-[hsla(210, 15%, 40%, 1)]`
- **color-text-tertiary**: `text-[hsla(210, 12%, 60%, 1)]`
- **color-text-quaternary**: `text-[hsla(210, 10%, 75%, 1)]`
- **color-text-on-dark-primary**: `text-white/95` - Text on dark backgrounds and primary-base, accent-dark color surfaces
- **color-text-on-dark-secondary**: `text-white/70` - Text on dark backgrounds and primary-base, accent-dark color surfaces
- **color-text-link**: `text-[#4A90E2]` - Links, text-only buttons without backgrounds, and clickable text in tables

### Functional Colors
Use **sparingly** to maintain a minimalist and neutral overall style. Used for the surfaces of text-only cards, simple cards, buttons, and tags.
  - **color-success-default**: #5CB85C
  - **color-success-light**: #D4EDDA - tag/label bg
  - **color-error-default**: #D9534F - alert banner bg
  - **color-error-light**: #F8D7DA - tag/label bg
  - **color-warning-default**: #F0AD4E - tag/label bg
  - **color-warning-light**: #FFF3CD - tag/label bg, alert banner bg
  - **color-function-default**: #5E81AC
  - **color-function-light**: #C8DDF5 - tag/label bg

### Accent Colors
  - A secondary palette for data categorization and refined visual hierarchy. **Avoid overuse** to protect brand identity. Use **sparingly**.
  - **accent-cyan**: `text-[#5BC0DE]` or `bg-[#5BC0DE]`
  - **accent-blue-gray**: `text-[#778DA9]` or `bg-[#778DA9]`
  - **accent-slate-blue**: `text-[#8B9DC3]` or `bg-[#8B9DC3]`

### Data Visualization Charts
For data visualization charts only.
  - Standard data colors: #4A90E2, #5BC0DE, #8B9DC3, #778DA9, #A3B9CC, #C8D5E0
  - Important data can use small amounts of: #5CB85C, #F0AD4E, #D9534F, #2E6DB8

## Typography
- **Font Stack**:
  - **font-family-base**: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif` — For regular UI copy

- **Font Size & Weight**:

  - **Caption**: `text-sm font-normal`
  - **Body**: `text-base font-normal`
  - **Body Emphasized**: `text-base font-semibold`
  - **Card Title / Subtitle**: `text-lg font-semibold`
  - **Page Title**: `text-2xl font-semibold`
  - **Headline**: `text-3xl font-semibold`

- **Line Height**: 1.5

## Border Radius
  - **Small**: 8px — Elements inside cards (e.g., photos, small buttons)
  - **Medium**: 12px — Buttons, inputs, tags
  - **Large**: 16px — Cards, panels
  - **Full**: full — Toggles, avatars, badges

## Layout & Spacing
  - **Tight**: 8px - For closely related small internal elements, such as icons and text within buttons
  - **Compact**: 12px - For small gaps between small containers, such as a line of tags
  - **Standard**: 16px - For gaps between medium containers like list items
  - **Relaxed**: 24px - For gaps between large containers and sections
  - **Section**: 32px - For major section divisions

## Create Boundaries (contrast of surface color, borders, shadows)
Primary approach: Flat design with subtle shadows for gentle elevation. Surface color contrast supports visual hierarchy.

### Borders
  - **Case 1**: For data tables, inputs, and cards requiring clear definition
    - **Default**: 1px solid hsla(210, 15%, 88%, 1). Used for inputs, table cells. `border border-[hsla(210,15%,88%,1)]`
    - **Stronger**: 1px solid hsla(210, 15%, 78%, 1). Used for active or focused states. `border border-[hsla(210,15%,78%,1)]`
  - **Case 2**: No borders for navigation elements, buttons, and standalone cards relying on shadows.

### Dividers
  - **Case 1**: For separating content sections and table rows, `border-t` or `border-b` `border-[hsla(210,15%,90%,1)]`.
  - **Case 2**: No dividers for navigation menus and card groups relying on spacing.

### Shadows & Effects
  - **Case 1 (no shadow)**: For flat elements like tags, badges, simple buttons
  - **Case 2 (subtle shadow)**: `shadow-[0_2px_8px_rgba(74,144,226,0.08)]` - Default for cards and panels
  - **Case 3 (moderate shadow)**: `shadow-[0_4px_12px_rgba(74,144,226,0.12)]` - Hover states and elevated panels
  - **Case 4 (pronounced shadow)**: `shadow-[0_6px_20px_rgba(74,144,226,0.15)]` - Modals and popovers

## Visual Emphasis for Containers
When containers (tags, cards, list items, rows) need visual emphasis to indicate priority, status, or category, use the following techniques:

| Technique | Implementation Notes | Best For | Avoid |
|-----------|---------------------|----------|-------|
| Background Tint | Slightly darker/lighter color or reduce transparency of backgrounds | Gentle, common approach for moderate emphasis needs | Heavy colors on large areas (e.g., red background for entire large cards) |
| Border Highlight | Use thin border with opacity for subtlety | Active/selected states, form validation | - |
| Glow/Shadow Effect | Keep shadow subtle with low opacity | Premium aesthetics, hover states | Flat/minimal designs |
| Status Tag/Label | Add colored tag/label inside container | Larger containers | - |
| Side Accent Bar | **Left edge only**, for **non-rounded containers** | Small non-rounded list items (e.g., side nav tabs), small non-rounded cards (e.g., task cards) | Large cards, wide list items, rounded containers |

## Assets
### Image

- For normal `<img>`: object-cover
- For `<img>` with:
  - Slight overlay: object-cover brightness-95
  - Heavy overlay: object-cover brightness-75

### Icon

- Use Lucide icons from Iconify.
- To ensure an aesthetic layout, each icon should be centered in a square container, typically without a background, matching the icon's size.
- Use Tailwind font size to control icon size
- Example:
  ```html
  <div class="flex items-center justify-center bg-transparent w-5 h-5">
  <iconify-icon icon="lucide:flag" class="text-base"></iconify-icon>
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
  - **Graphic**: Use a simple, relevant icon (e.g., a `database` icon for a data platform, a `brain` icon for an AI platform).

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
<body class="w-[1440px] min-h-[900px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI','Roboto','Helvetica_Neue',Arial,sans-serif] leading-[1.5]">

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
<body class="w-[1440px] min-h-[900px] flex font-[-apple-system,BlinkMacSystemFont,'Segoe_UI','Roboto','Helvetica_Neue',Arial,sans-serif] leading-[1.5]">

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
  - Example 1 (Primary button):
    - button: flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white/95 rounded-xl shadow-[0_2px_8px_rgba(74,144,226,0.08)] hover:bg-[#2E6DB8] transition
      - icon (optional)
      - span(button copy): whitespace-nowrap font-medium
  - Example 2 (Secondary button):
    - button: flex items-center gap-2 px-4 py-2 bg-white text-[#4A90E2] border border-[#4A90E2]/20 rounded-xl hover:bg-[#4A90E2]/5 transition
      - icon (optional)
      - span(button copy): whitespace-nowrap font-medium
  - Example 3 (Text button):
    - button: flex items-center gap-2 px-3 py-2 text-[#4A90E2] hover:bg-[#4A90E2]/5 rounded-lg transition
      - icon (optional)
      - span(button copy): whitespace-nowrap
  - Example 4 (Icon button):
    - button: flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#4A90E2]/5 transition
      - icon: text-xl text-[#4A90E2]

- **Tag Group (Filter Tags)** (Note: `overflow-x-auto` and `whitespace-nowrap` are required)
  - container(scrollable): flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden
    - label (Tag item 1):
      - input: type="radio" name="tag1" class="sr-only peer" checked
      - div: px-4 py-2 bg-[hsla(210,25%,99%,1)] text-[hsla(210,15%,40%,1)] rounded-full border border-[hsla(210,15%,88%,1)] peer-checked:bg-[#4A90E2] peer-checked:text-white/95 peer-checked:border-[#4A90E2] hover:border-[#4A90E2]/40 transition whitespace-nowrap cursor-pointer

### Data Entry
- **Progress bars/Slider**: h-2 bg-[hsla(210,15%,90%,1)] rounded-full
  - Progress fill: h-2 bg-[#4A90E2] rounded-full

- **Checkbox**
  - label: flex items-center gap-3 cursor-pointer
    - input: type="checkbox" class="sr-only peer"
    - div: w-5 h-5 bg-white border border-[hsla(210,15%,88%,1)] rounded flex items-center justify-center peer-checked:bg-[#4A90E2] peer-checked:border-[#4A90E2] text-transparent peer-checked:text-white/95 transition
      - svg(Checkmark): stroke="currentColor" stroke-width="3" viewBox="0 0 16 16" class="w-3 h-3"
        - path: d="M3 8l3 3 7-7"
    - span(text): text-base text-[hsla(210,15%,40%,1)]

- **Radio button**
  - label: flex items-center gap-3 cursor-pointer
    - input: type="radio" name="option1" class="sr-only peer"
    - div: w-5 h-5 bg-white border border-[hsla(210,15%,88%,1)] rounded-full flex items-center justify-center peer-checked:bg-[#4A90E2] peer-checked:border-[#4A90E2] text-transparent peer-checked:text-white/95 transition
      - svg(dot indicator): fill="currentColor" viewBox="0 0 16 16" class="w-2 h-2"
        - circle: cx="8" cy="8" r="4"
    - span(text): text-base text-[hsla(210,15%,40%,1)]

- **Switch/Toggle**
  - label: flex items-center gap-3 cursor-pointer
    - div: relative
      - input: type="checkbox" class="sr-only peer"
      - div(Toggle track): w-11 h-6 bg-[hsla(210,15%,88%,1)] peer-checked:bg-[#4A90E2] rounded-full transition
      - div(Toggle thumb): absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] peer-checked:translate-x-5 transition
    - span(text): text-base text-[hsla(210,15%,40%,1)]

- **Select/Dropdown**
  - Select container: flex items-center gap-2 px-4 py-2 bg-white border border-[hsla(210,15%,88%,1)] rounded-xl cursor-pointer hover:border-[#4A90E2]/40 transition
    - text: text-base text-[hsla(210,15%,40%,1)]
    - Dropdown icon(square container): flex items-center justify-center bg-transparent w-4 h-4
      - icon: text-sm text-[hsla(210,15%,60%,1)]

- **Input Field**
  - input: px-4 py-2 bg-white border border-[hsla(210,15%,88%,1)] rounded-xl text-base text-[hsla(210,18%,20%,1)] placeholder:text-[hsla(210,10%,75%,1)] focus:outline-none focus:border-[#4A90E2] transition

### Container
- **Navigation Menu - horizontal**
    - Navigation with sections/grouping:
        - Nav Container: flex items-center justify-between w-full h-16 px-8
        - Left Section: flex items-center gap-8
          - Menu Item: flex items-center gap-2 text-base text-[hsla(210,15%,40%,1)] hover:text-[#4A90E2] transition cursor-pointer
            - icon (optional): text-lg
            - text
        - Right Section: flex items-center gap-4
          - Menu Item: flex items-center gap-2 text-base text-[hsla(210,15%,40%,1)] hover:text-[#4A90E2] transition cursor-pointer
          - Notification (if applicable): relative flex items-center justify-center w-10 h-10 hover:bg-[#4A90E2]/5 rounded-lg transition cursor-pointer
            - notification-icon: w-5 h-5 text-[hsla(210,15%,40%,1)]
            - badge (if has unread): absolute -top-1 -right-1 w-5 h-5 bg-[#D9534F] rounded-full flex items-center justify-center
              - badge-count: text-xs text-white/95 font-semibold
          - Avatar(if applicable): flex items-center gap-2 cursor-pointer
            - avatar-image: w-9 h-9 rounded-full border-2 border-[hsla(210,15%,88%,1)]
            - dropdown-icon (if applicable): w-4 h-4 text-[hsla(210,15%,60%,1)]

- **Card**
    - Example 1 (Data card with shadow):
        - Card: bg-white rounded-2xl shadow-[0_2px_8px_rgba(74,144,226,0.08)] p-6 flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(74,144,226,0.12)] transition
        - Card header: flex items-center justify-between
          - card-title: text-lg font-semibold text-[hsla(210,18%,20%,1)]
          - card-action (optional): text-sm text-[#4A90E2] cursor-pointer
        - Card content: flex flex-col gap-3
          - card-metric: text-3xl font-semibold text-[hsla(210,18%,20%,1)]
          - card-description: text-sm text-[hsla(210,15%,40%,1)]
    - Example 2 (List item card):
        - Card: bg-white rounded-xl border border-[hsla(210,15%,88%,1)] p-4 flex items-center gap-4 hover:border-[#4A90E2]/40 transition cursor-pointer
        - Icon/Image: w-12 h-12 rounded-lg bg-[#4A90E2]/5 flex items-center justify-center
          - icon: text-2xl text-[#4A90E2]
        - Text area: flex-1 flex flex-col gap-1
          - card-title: text-base font-semibold text-[hsla(210,18%,20%,1)]
          - card-subtitle: text-sm text-[hsla(210,15%,40%,1)]
        - Action area (optional): flex items-center
          - action-button or icon
    - Example 3 (Table card - data table container):
        - Card: bg-white rounded-2xl shadow-[0_2px_8px_rgba(74,144,226,0.08)] overflow-hidden
        - Card header: px-6 py-4 border-b border-[hsla(210,15%,90%,1)] flex items-center justify-between
          - card-title: text-lg font-semibold text-[hsla(210,18%,20%,1)]
          - card-actions: flex items-center gap-3
        - Table container: overflow-x-auto
          - table: w-full
            - thead: bg-[hsla(210,25%,99%,1)]
              - tr
                - th: px-6 py-3 text-left text-sm font-semibold text-[hsla(210,15%,40%,1)]
            - tbody
              - tr: border-t border-[hsla(210,15%,90%,1)] hover:bg-[hsla(210,25%,99%,1)] transition
                - td: px-6 py-4 text-sm text-[hsla(210,18%,20%,1)]

## Additional Notes

- **Data Table Optimization**: For enterprise data platforms, tables are critical. Use consistent spacing (px-6 py-3/4), clear borders (hsla(210,15%,90%,1)), and subtle hover states (bg-[hsla(210,25%,99%,1)]) for optimal readability.
- **Shadow Consistency**: Apply shadows consistently across similar components. Cards use subtle shadows (0_2px_8px), hover states use moderate shadows (0_4px_12px), and modals use pronounced shadows (0_6px_20px).
- **Color Application**: Primary blue (#4A90E2) should be used for interactive elements, links, and key actions. Accent colors are for data categorization and should not compete with primary interactions.
- **White Space**: Generous spacing (16-32px between sections) ensures clarity in data-dense interfaces. Avoid cramping content.
- **Accessibility**: Maintain WCAG AA contrast ratios. Text colors are carefully selected to ensure readability against background colors.

<colors_extraction>
#4A90E2
#7AB3F5
#2E6DB8
hsla(210, 18%, 97%, 1)
hsla(210, 20%, 98%, 1)
radial-gradient(ellipse 800px 600px at 20% 30%, hsla(210, 60%, 96%, 0.4) 0%, hsla(210, 60%, 96%, 0) 50%), radial-gradient(ellipse 700px 500px at 80% 70%, hsla(200, 50%, 94%, 0.3) 0%, hsla(200, 50%, 94%, 0) 50%), hsla(210, 15%, 98%, 1)
#FFFFFF
hsla(210, 25%, 99%, 1)
#4A90E20D
#4A90E21A
hsla(210, 18%, 20%, 1)
hsla(210, 15%, 40%, 1)
hsla(210, 12%, 60%, 1)
hsla(210, 10%, 75%, 1)
#FFFFFFF2
#FFFFFFB3
#5CB85C
#D4EDDA
#D9534F
#F8D7DA
#F0AD4E
#FFF3CD
#5E81AC
#C8DDF5
#5BC0DE
#778DA9
#8B9DC3
#A3B9CC
#C8D5E0
hsla(210, 15%, 88%, 1)
hsla(210, 15%, 78%, 1)
hsla(210, 15%, 90%, 1)
rgba(74, 144, 226, 0.08)
rgba(74, 144, 226, 0.12)
rgba(74, 144, 226, 0.15)
#4A90E233
#4A90E266
rgba(0, 0, 0, 0.1)
</colors_extraction>
