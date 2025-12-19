# Instructions for Capturing Screenshots of Enterprise AI Workstation

This document provides step-by-step instructions for capturing screenshots of the key functionality in the enterprise AI workstation application. Screenshots should be saved in the `/Users/wangyu94/enterprise_ai_workstation/screenshots/` directory.

## Prerequisites

1. Make sure the development server is running:
   ```bash
   cd /Users/wangyu94/enterprise_ai_workstation/frontend_demo
   npm run dev
   ```

2. Access the application at http://localhost:3000

## Screenshots to Capture

### 1. Dashboard Page
**URL:** http://localhost:3000 or http://localhost:3000/dashboard
**Filename:** `dashboard.png`
**Description:** Capture the main dashboard showing KPI cards, charts, and recent activity.

**Instructions:**
- Navigate to the dashboard
- Ensure all charts are visible and rendered properly
- Capture the entire viewport showing the dashboard layout

### 2. Enterprises List Page
**URL:** http://localhost:3000/enterprises
**Filename:** `enterprises_list.png`
**Description:** Capture the enterprises listing page with search and filter controls.

**Instructions:**
- Navigate to the enterprises page
- Ensure the search bar, filter dropdowns, and enterprise cards are visible
- Capture the entire viewport showing the enterprise listings

### 3. Advanced Filtering
**URL:** http://localhost:3000/enterprises
**Filename:** `advanced_filtering.png`
**Description:** Capture the enterprises page with advanced filters expanded.

**Instructions:**
- Navigate to the enterprises page
- Click on "高级筛选" (Advanced Filter) button
- Ensure all filter options are visible
- Capture the expanded filter section

### 4. Import/Export Page
**URL:** http://localhost:3000/import-export
**Filename:** `import_export.png`
**Description:** Capture the import/export functionality page.

**Instructions:**
- Navigate to the import/export page
- Switch to the "数据导入" (Data Import) tab
- Ensure the file upload area and import configuration are visible
- Capture the entire viewport showing the import interface

### 5. Export Functionality
**URL:** http://localhost:3000/import-export
**Filename:** `data_export.png`
**Description:** Capture the data export section of the import/export page.

**Instructions:**
- Navigate to the import/export page
- Switch to the "数据导出" (Data Export) tab
- Ensure the export options and preview table are visible
- Capture the entire viewport showing the export interface

### 6. Import History
**URL:** http://localhost:3000/import-export
**Filename:** `import_history.png`
**Description:** Capture the import history section of the import/export page.

**Instructions:**
- Navigate to the import/export page
- Switch to the "导入历史" (Import History) tab
- Ensure the import history table is visible
- Capture the entire viewport showing the history table

### 7. Enterprise Card Detail
**URL:** http://localhost:3000/enterprises
**Filename:** `enterprise_card.png`
**Description:** Capture a close-up of a single enterprise card showing details.

**Instructions:**
- Navigate to the enterprises page
- Focus on a single enterprise card
- Capture details including name, industry tag, legal rep, employee/revenue info, and AI application status
- Zoom in if necessary to show card details clearly

### 8. Tasks Management
**URL:** http://localhost:3000/tasks
**Filename:** `tasks_management.png`
**Description:** Capture the tasks management page.

**Instructions:**
- Navigate to the tasks page
- Ensure the task list and filtering options are visible
- Capture the entire viewport showing the task management interface

### 9. Settings Page
**URL:** http://localhost:3000/settings
**Filename:** `settings_page.png`
**Description:** Capture the settings page with configurable options.

**Instructions:**
- Navigate to the settings page
- Ensure different setting sections are visible
- Capture the entire viewport showing the settings interface

### 10. Dark Mode View
**URL:** http://localhost:3000/dashboard
**Filename:** `dark_mode.png`
**Description:** Capture any page with dark mode enabled.

**Instructions:**
- Navigate to any page
- Click the theme toggle to switch to dark mode
- Capture the page in dark mode
- Ensure the dark theme is clearly visible

## Additional Tips for Screenshot Quality

1. **Browser Window Size:** Use a consistent browser window size (e.g., 1920x1080) for all screenshots
2. **Zoom Level:** Keep browser zoom at 100% for consistency
3. **Extensions:** Disable browser extensions that might interfere with the UI
4. **Ad Blocking:** Ensure ad blockers are disabled so all elements render properly
5. **Font Rendering:** Make sure text is crisp and readable in all screenshots

## How to Take Screenshots

### On macOS:
- **Full Screen:** Press `Cmd + Shift + 3`
- **Selected Area:** Press `Cmd + Shift + 4` and drag to select
- **Specific Window:** Press `Cmd + Shift + 4` then press `Space` and click on the window

### Using Browser Developer Tools:
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Navigate to the Elements tab
3. Right-click on the `<body>` element
4. Select "Capture node screenshot"

## How to Save Screenshots

1. After taking each screenshot, save it to: `/Users/wangyu94/enterprise_ai_workstation/screenshots/`
2. Use the exact filenames specified in the instructions above
3. If using macOS screenshot shortcuts, you may need to rename and move files to the correct directory

## Verification Checklist

After capturing all screenshots, verify:
1. All screenshots are in the `/Users/wangyu94/enterprise_ai_workstation/screenshots/` directory
2. All screenshots have the correct filenames
3. All UI elements are clearly visible and not cut off
4. Text is readable and not blurry
5. All screenshots represent the intended functionality