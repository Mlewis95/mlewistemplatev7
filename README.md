# Kenton County Animal Shelter - Volunteer Management System

A modern web application for managing volunteer activities at the Kenton County Animal Shelter, built with React Router and Mantine UI.

## Features

### Navigation System
- **Mantine AppShell**: Modern sidebar navigation with responsive design
- **Dashboard**: Volunteer task management, dog walking logs, and announcements
- **Adoptable Pets**: Browse and manage adoptable dogs and cats with training levels

### Key Components

#### Dashboard (`/`)
- Task management for volunteers and managers
- Dog walking log with time tracking
- Announcement system with comments
- Quick action buttons for common tasks
- User statistics and progress tracking

#### Adoptable Pets (`/pets`)
- Browse adoptable dogs and cats
- Filter by fosterable status
- Training level indicators (Green, Yellow, Blue, Red, Black)
- Pet details with temperament notes
- Manager-only editing capabilities

### Navigation Features
- **Responsive Design**: Collapsible sidebar on mobile devices
- **Active State Indicators**: Visual feedback for current page
- **Breadcrumb Navigation**: Shows current location in the app
- **Smooth Transitions**: Hover effects and animations

### Technical Stack
- **Frontend**: React 19, React Router 7
- **UI Framework**: Mantine 8 with custom theme
- **Icons**: Tabler Icons
- **Database**: Supabase (PostgreSQL)
- **Styling**: Mantine CSS with custom color palette

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the application

## Navigation Structure

```
/ (Dashboard)
├── Task Management
├── Dog Walking Log
├── Announcements
└── Quick Actions

/pets (Adoptable Pets)
├── Dogs Tab
├── Cats Tab
├── Fosterable Filter
└── Pet Details Modal
```

## User Roles

- **Volunteer**: Can view tasks, log dog walks, and browse pets
- **Manager**: Full access including task creation, pet editing, and announcements

## Theme Customization

The application uses a custom Mantine theme with:
- Primary color: Orange
- Background: Warm cream tones
- Accent colors: Blue, Green, Purple variants
- Custom color palette for animal shelter branding
