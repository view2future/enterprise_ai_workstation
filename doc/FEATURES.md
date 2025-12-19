# Regional AI Industry Enterprise Data Management Platform - Feature List

## 1. Overall System Features

### 1.1 Application Architecture
- React-based single-page application
- TypeScript for type safety
- Vite as build tool and development server
- Tailwind CSS for styling with neubrutalism design
- Recharts for data visualization
- Lucide React for icon library
- Responsive design for desktop and mobile

### 1.2 Navigation & Layout
- Responsive sidebar navigation with collapsible menu
- Top header with search functionality
- User profile section with dark/light theme toggle
- Mobile-friendly design with hamburger menu

### 1.3 Theme & Styling
- Dark/light mode toggle
- Neubrutalism design aesthetic with distinctive borders and shadows
- Responsive layout using Tailwind CSS utility classes
- Consistent color scheme and UI components

## 2. Core Functionality Pages

### 2.1 Dashboard Page
**URL Path:** `/` or `/dashboard`

#### 2.1.1 KPI Summary Cards
- Total enterprises count
- Enterprises with AI applications
- Enterprises using Baidu AI services
- High-potential enterprises
- Monthly growth percentages

#### 2.1.2 Data Visualization
- Industry distribution pie chart
- AI application scenarios bar chart
- Monthly trend line chart

#### 2.1.3 Recent Activity
- Shows recently updated enterprises
- Displays update timestamps
- Includes enterprise name and action taken

#### 2.1.4 Task Management
- Shows upcoming tasks
- Displays task deadlines
- Provides quick access to task details

### 2.2 Enterprise Management
**URL Path:** `/enterprises`

#### 2.2.1 Enterprise Listing
- Displays all enterprises in card format
- Each card shows enterprise name, legal representative, employee count, revenue
- Shows AI application status and Baidu AI usage

#### 2.2.2 Search & Filtering
- Search by enterprise name, legal representative, or industry
- Industry filter dropdown
- Region filter dropdown
- Advanced filtering panel with:
  - Sub-industry filter
  - Employee size filter
  - AI application stage filter
  - Baidu AI usage filter

#### 2.2.3 Enterprise Actions
- Add new enterprise button
- Export data button
- View enterprise details
- Edit enterprise information
- Additional options via dropdown

#### 2.2.4 Enterprise Card Components
- Displays enterprise name and industry
- Shows legal representative and employee/revenue info
- AI application scenario and implementation stage
- Baidu AI usage level
- Update timestamp

### 2.3 Import/Export Management
**URL Path:** `/import-export`

#### 2.3.1 Data Import Functionality
- File upload for Excel (.xlsx, .xls) and CSV (.csv) files
- File preview and validation
- Upload progress tracking
- Field mapping between file columns and system fields
- Import options (update existing records, send notifications)

#### 2.3.2 Data Export Functionality
- Export options for different data ranges
- Multiple export formats (Excel, CSV)
- Selectable fields for export
- Data preview before export
- Bulk export button

#### 2.3.3 Import History Tracking
- Historical import jobs listing
- Status tracking (completed, failed, processing)
- Success/failure counts
- Error details for failed imports
- Import date and time
- Actions: Details view and delete

### 2.4 Task Management
**URL Path:** `/tasks`

#### 2.4.1 Task Listing
- Shows all pending tasks
- Task status indicators
- Due date display
- Priority level indicators
- Task assignee information

#### 2.4.2 Task Filtering
- Filter by status (pending, in progress, completed)
- Filter by priority (low, medium, high, urgent)
- Filter by assignee
- Filter by due date range

#### 2.4.3 Task Operations
- Create new tasks
- Mark tasks as complete
- Edit task details
- Reassign tasks to different users
- Set task priorities

### 2.5 Settings Page
**URL Path:** `/settings`

#### 2.5.1 User Profile Management
- Update user information
- Change password
- Update contact information
- Avatar management

#### 2.5.2 System Preferences
- Theme selection (light/dark)
- Language preferences
- Notification settings
- Dashboard display preferences

#### 2.5.3 Data Management
- Export data preferences
- Backup settings
- Archive old records
- Data retention policies

#### 2.5.4 Integration Settings
- API key management
- Third-party service integrations
- Data sync preferences
- Webhook configurations

## 3. Data Models & Structure

### 3.1 Enterprise Data Model
- Basic information: name, legal representative, registration info
- Financial data: employee count, annual revenue
- Location data: region, city, address
- Industry classification: main industry, sub-industry
- AI application tracking: scenarios, implementation stages
- Baidu AI usage: usage level, integration details
- Operational tags: high potential, focus areas, etc.
- Contact information and notes

### 3.2 AI Application Tracking
- AI scenario type (computer vision, NLP, etc.)
- Implementation stage (pilot, production, scaled)
- ROI metrics and benefits
- Implementation timeline
- Responsible team/department

### 3.3 Baidu AI Integration
- Usage level (none, evaluating, production, extensive)
- Services used (Baidu AI Cloud, specific APIs, etc.)
- Usage metrics and consumption
- Integration date and status
- Key contacts for Baidu AI relationship

### 3.4 Task Management Data
- Task title and description
- Status tracking (to do, in progress, done)
- Priority levels (low, medium, high, urgent)
- Assignee and due date
- Associated enterprise if applicable
- Progress tracking and notes

## 4. UI/UX Features

### 4.1 Responsive Design
- Adapts to different screen sizes
- Mobile-first approach
- Collapsible sidebar for small screens
- Responsive grid layouts

### 4.2 Interactive Elements
- Hover effects on cards and buttons
- Interactive charts with tooltips
- Expandable/collapsible sections
- Animated transitions between states

### 4.3 Accessibility
- Semantic HTML structure
- Proper contrast ratios for text
- Keyboard navigation support
- Screen reader compatible components

## 5. Technical Features

### 5.1 Performance
- Efficient data loading and caching
- Virtualized lists for large datasets
- Lazy loading of components
- Optimized bundle sizes

### 5.2 Mock Data System
- Comprehensive mock data for demonstration
- Realistic enterprise information
- Sample AI application scenarios
- Various usage levels and implementation stages