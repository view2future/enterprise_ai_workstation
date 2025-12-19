# Enterprise Data Platform Style Guide

**Style Overview**:
A modern flat design with deep business professional tone, using deep navy blue as the primary color with subtle surface color contrasts to create clear visual hierarchy, complemented by refined spacing and minimal rounded corners for a stable, data-driven, and authoritative aesthetic.

## Colors
### Primary Colors
  - **primary-base**: `text-[#1A3A5C]` or `bg-[#1A3A5C]`
  - **primary-lighter**: `bg-[#2D4E73]`
  - **primary-darker**: `text-[#0F2942]` or `bg-[#0F2942]`

### Background Colors

#### Structural Backgrounds

Choose based on layout type:

**For Vertical Layout** (Top Header + Optional Side Panels):
- **bg-nav-primary**: `bg-[hsla(210, 18%, 12%, 1)]` - Top header
- **bg-nav-secondary**: `bg-[hsla(210, 18%, 15%, 1)]` - Inner Left sidebar (if present)
- **bg-page**: `bg-[hsla(210, 15%, 96%, 1)]` - Page background (bg of Main Content area)

**For Horizontal Layout** (Side Navigation + Optional Top Bar):
- **bg-nav-primary**: `bg-[hsla(210, 18%, 12%, 1)]` - Left main sidebar
- **bg-nav-secondary**: `bg-[hsla(210, 15%, 96%, 1)]` - Inner Top header (if present)
- **bg-page**: `bg-[hsla(210, 15%, 96%, 1)]` - Page background (bg of Main Content area)

#### Container Backgrounds
For main content area. Adjust values when used on navigation backgrounds to ensure sufficient contrast.
- **bg-container-primary**: `bg-white`
- **bg-container-secondary**: `bg-[hsla(210, 20%, 98%, 1)]`
- **bg-container-inset**: `bg-[hsla(210, 25%, 94%, 1)]`
- **bg-container-inset-strong**: `bg-[hsla(210, 30%, 90%, 1)]`

### Text Colors
- **color-text-primary**: `text-[hsla(210, 25%, 15%, 1)]`
- **color-text-secondary**: `text-[hsla(210, 15%, 40%, 1)]`
- **color-text-tertiary**: `text-[hsla(210, 12%, 55%, 1)]`
- **color-text-quaternary**: `text-[hsla(210, 10%, 70%, 1)]`
- **color-text-on-dark-primary**: `text-white/95` - Text on dark backgrounds and primary-base color surfaces
- **color-text-on-dark-secondary**: `text-white/70` - Text on dark backgrounds and primary-base color surfaces
- **color-text-link**: `text-[#3D6FA8]` - Links, text-only buttons without backgrounds, and clickable text in tables

### Functional Colors
Use **sparingly** to maintain a minimalist and neutral overall style. Used for the surfaces of text-only cards, simple cards, buttons, and tags.
  - **color-success-default**: #4A9B7F
  - **color-success-light**: #E8F5F1 - tag/label bg
  - **color-error-default**: #C85A54 - alert banner bg
  - **color-error-light**: #FDECEA - tag/label bg
  - **color-warning-default**: #E09B4D - tag/label bg
  - **color-warning-light**: #FEF5E7 - tag/label bg, alert banner bg
  - **color-function-default**: #3D6FA8
  - **color-function-light**: #E8F1FA - tag/label bg

### Accent Colors
  - A secondary palette for occasional highlights and categorization. **Avoid overuse** to protect brand identity. Use **sparingly**.
  - **accent-slate**: `text-[#5A6C7D]` or `bg-[#5A6C7D]`
  - **accent-blue-gray**: `text-[#7A8FA5]` or `bg-[#7A8FA5]`

### Data Visualization Charts
For data visualization charts only.
  - Standard data colors: #1A3A5C, #3D6FA8, #5A6C7D, #7A8FA5, #9DB4C8, #C2D4E3
  - Important data can use small amounts of: #4A9B7F, #E09B4D, #C85A54

## Typography
- **Font Stack**:
  - **font-family-base**: `-apple-system, BlinkMacSystemFont, "Segoe UI"` — For regular UI copy

- **Font Size & Weight**:

  - **Caption**: `text-sm font-normal`
  - **Body**: `text-base font-normal`
  - **Body Emphasized**: `text-base font-semibold`
  - **Card Title / Subtitle**: `text-lg font-semibold`
  - **Page Title**: `text-xl font-semibold`
  - **Headline**: `text-3xl font-semibold`

- **Line Height**: 1.5

## Border Radius
  - **Small**: 4px — Elements inside cards (e.g., input fields, small buttons)
  - **Medium**: 6px — Standard UI elements (buttons, tags)
  - **Large**: 8px — Cards, panels
  - **Full**: full — Avatars, status indicators

## Layout & Spacing
  - **Tight**: 8px - For closely related small internal elements, such as icons and text within buttons
  - **Compact**: 12px - For small gaps between small containers, such as a line of tags
  - **Standard**: 16px - For gaps between medium containers like list items, table rows
  - **Relaxed**: 24px - For gaps between large containers and card groups
  - **Section**: 32px - For major section divisions

## Create Boundaries (contrast of surface color, borders, shadows)
Overall interface uses flat design without shadows, primarily relying on surface color contrast to create boundaries. Weak contrast is used for most areas to maintain a clean, minimalist aesthetic, while clear contrast is applied to key interactive areas and important data containers for emphasis.

### Borders
  - **Case 1**: No borders for most containers and cards.
  - **Case 2**: If needed for input fields, data tables, and critical interactive elements
    - **Default**: 1px solid #E5E9ED. Used for inputs, table cells. `border border-[#E5E9ED]`
    - **Stronger**: 1px solid #D1D8DE. Used for active or focused states. `border border-[#D1D8DE]`

### Dividers
  - **Case 1**: No dividers for general content sections.
  - **Case 2**: If needed for table headers, navigation sections, and major content divisions, `border-t` or `border-b` `border-[#E5E9ED]`.

### Shadows & Effects
  - **Case 1**: No shadow - maintains flat design principle throughout the interface.

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
  - Slight overlay: object-cover brightness-85
  - Heavy overlay: object-cover brightness-50

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
  - **Graphic**: Use a simple, relevant icon (e.g., a `calendar` icon for a scheduling app, a `heart` icon for a dating app).

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
<body class="w-[1440px] min-h-[700px] font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] leading-[1.5]">

  <!-- Header (Primary Nav): Fixed height -->
  <header class="w-full">
    <!-- Header content -->
  </header>

  <!-- Content Container: Must include 'flex' class -->
  <div class="w-full flex min-h-[700px]">
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
<body class="w-[1440px] min-h-[700px] flex font-[-apple-system,BlinkMacSystemFont,'Segoe UI'] leading-[1.5]">

<!-- Left Sidebar (Primary Nav): Use its ml to control left page margin -->
  <aside class="flex-shrink-0 min-w-fit">
  </aside>

  <!-- Content Container-->
  <div class="flex-1 overflow-x-hidden flex flex-col min-h-[700px]">

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
  - Example 1 (Primary button - solid):
    - button: flex items-center bg-[#1A3A5C] text-white/95 hover:bg-[#2D4E73] px-4 py-2 rounded-md
      - span(button copy): whitespace-nowrap text-base
  - Example 2 (Secondary button - outlined):
    - button: flex items-center border border-[#1A3A5C] text-[#1A3A5C] hover:bg-[hsla(210, 25%, 94%, 1)] px-4 py-2 rounded-md
      - span(button copy): whitespace-nowrap text-base
  - Example 3 (Text button):
    - button: flex items-center text-[#3D6FA8] hover:opacity-70
      - span(button copy): whitespace-nowrap text-base
  - Example 4 (Icon button):
    - button: flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsla(210, 25%, 94%, 1)]
      - icon: text-lg

- **Tag Group (Filter Tags)** (Note: `overflow-x-auto` and `whitespace-nowrap` are required)
  - container(scrollable): flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden
    - label (Tag item):
      - input: type="radio" name="tag" class="sr-only peer" checked
      - div: bg-[hsla(210, 25%, 94%, 1)] text-[hsla(210, 15%, 40%, 1)] peer-checked:bg-[#1A3A5C] peer-checked:text-white/95 hover:opacity-80 transition whitespace-nowrap px-4 py-2 rounded-md text-sm

### Data Entry
- **Progress bars/Slider**: h-2 bg-[hsla(210, 25%, 94%, 1)] rounded-full
  - Progress fill: bg-[#1A3A5C] h-full rounded-full
- **Checkbox**
  - label: flex items-center gap-2
    - input: type="checkbox" class="sr-only peer"
    - div: w-5 h-5 bg-[hsla(210, 25%, 94%, 1)] rounded flex items-center justify-center peer-checked:bg-[#1A3A5C] text-transparent peer-checked:text-white/95 border border-[#E5E9ED]
      - svg(Checkmark): stroke="currentColor" stroke-width="3"
    - span(text): text-base
- **Radio button**
  - label: flex items-center gap-2
    - input: type="radio" name="option" class="sr-only peer"
    - div: w-5 h-5 bg-[hsla(210, 25%, 94%, 1)] rounded-full flex items-center justify-center peer-checked:bg-[#1A3A5C] text-transparent peer-checked:text-white/95 border border-[#E5E9ED]
      - svg(dot indicator): fill="currentColor" width="10" height="10"
    - span(text): text-base
- **Switch/Toggle**
  - label: flex items-center gap-2
    - div: relative
      - input: type="checkbox" class="sr-only peer"
      - div(Toggle track): w-11 h-6 bg-[hsla(210, 25%, 94%, 1)] peer-checked:bg-[#1A3A5C] transition rounded-full
      - div(Toggle thumb): absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition shadow-sm
    - span(text): text-base

- **Input Field**
  - container: flex flex-col gap-1
    - label: text-sm text-[hsla(210, 15%, 40%, 1)]
    - input: px-3 py-2 bg-white border border-[#E5E9ED] rounded-md text-base focus:border-[#3D6FA8] focus:outline-none

- **Select/Dropdown**
  - Select container: flex items-center justify-between px-3 py-2 bg-white border border-[#E5E9ED] rounded-md
    - text: text-base
    - Dropdown icon(square container): flex items-center justify-center bg-transparent w-5 h-5
      - icon: text-base text-[hsla(210, 15%, 40%, 1)]

### Container
- **Navigation Menu - horizontal**
    - Navigation with sections/grouping:
        - Nav Container: flex items-center justify-between w-full px-6 py-4
        - Left Section: flex items-center gap-8
          - Menu Item: flex items-center gap-2 text-base hover:opacity-70 transition
        - Right Section: flex items-center gap-4
          - Menu Item: flex items-center gap-2 text-base hover:opacity-70 transition
          - Notification (if applicable): relative flex items-center justify-center w-9 h-9
            - notification-icon: w-5 h-5
            - badge (if has unread): absolute -top-1 -right-1 w-5 h-5 bg-[#C85A54] rounded-full flex items-center justify-center
              - badge-count: text-xs text-white/95
          - Avatar(if applicable): flex items-center gap-2
            - avatar-image: w-9 h-9 rounded-full
            - dropdown-icon (if applicable): w-5 h-5

- **Card**
    - Example 1 (Data card with metrics):
        - Card: bg-white rounded-lg flex flex-col p-6 gap-4
        - Header: flex items-center justify-between
          - card-title: text-lg font-semibold text-[hsla(210, 25%, 15%, 1)]
          - action-icon: w-5 h-5 text-[hsla(210, 15%, 40%, 1)]
        - Metrics area: flex flex-col gap-2
          - metric-value: text-3xl font-semibold text-[hsla(210, 25%, 15%, 1)]
          - metric-label: text-sm text-[hsla(210, 15%, 40%, 1)]
    - Example 2 (List card with items):
        - Card: bg-white rounded-lg flex flex-col
        - Card header: px-6 py-4 border-b border-[#E5E9ED]
          - card-title: text-lg font-semibold
        - Card content: flex flex-col
          - List item: px-6 py-3 flex items-center justify-between hover:bg-[hsla(210, 25%, 98%, 1)]
    - Example 3 (Enterprise info card):
        - Card: bg-white rounded-lg flex flex-col p-6 gap-4
        - Header: flex items-center gap-4
          - Company logo: w-12 h-12 rounded
          - Info: flex flex-col gap-1
            - company-name: text-lg font-semibold
            - company-category: text-sm text-[hsla(210, 15%, 40%, 1)]
        - Details: flex flex-col gap-3
          - Detail row: flex items-center gap-2 text-base

- **Data Table**
    - Table container: bg-white rounded-lg overflow-hidden
      - table: w-full
        - thead: bg-[hsla(210, 25%, 94%, 1)]
          - tr:
            - th: px-6 py-3 text-left text-sm font-semibold text-[hsla(210, 15%, 40%, 1)]
        - tbody:
          - tr: border-t border-[#E5E9ED] hover:bg-[hsla(210, 25%, 98%, 1)]
            - td: px-6 py-4 text-base

## Additional Notes

For enterprise data platforms, prioritize clarity and scannability in data-dense interfaces. Use consistent spacing and alignment to create visual rhythm. Apply color sparingly to highlight important information and status indicators. Maintain high contrast ratios for accessibility in prolonged usage scenarios.

<colors_extraction>
#1A3A5C
#2D4E73
#0F2942
#1E2426
#262A2E
#F4F5F6
#FFFFFF
#FAFBFC
#EFF2F5
#E5EBF0
#262A2EFF
#666A70
#8C9199
#B3B8BD
#FFFFFF99
#FFFFFFB3
#4A9B7F
#E8F5F1
#C85A54
#FDECEA
#E09B4D
#FEF5E7
#3D6FA8
#E8F1FA
#5A6C7D
#7A8FA5
#9DB4C8
#C2D4E3
#E5E9ED
#D1D8DE
</colors_extraction>
