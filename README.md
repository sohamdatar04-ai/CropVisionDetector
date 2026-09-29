# cropVision

A responsive React + TypeScript web app for crop health monitoring and field advisory. The project is designed as an offline-first dashboard for farmers and agronomists to assess crop stress, review field conditions, track weather, and access actionable recommendations from a mobile-friendly interface.

## Overview

cropVision brings together the core ideas of:

- crop disease and stress detection workflows
- field and plot management
- weather and climate awareness
- offline-first experience for low-connectivity areas
- multilingual farmer-friendly UI
- agronomy guidance through a conversational assistant panel

The app is structured as a front-end prototype and dashboard experience for a modern agricultural decision support tool.

## Features

- Home landing experience with product messaging and quick action CTA
- Dashboard summarizing crop health, risk levels, and field status
- Analyze page for crop inspection and result exploration
- History page showing previous diagnostics and scan records
- AI assistant page for agronomic recommendations and guidance
- Fields section for managing farms and plot data
- Weather page with agricultural forecast and spray-window indicators
- Offline page for local storage and device-ready behavior
- Settings page with localization and preference controls
- Responsive navigation optimized for mobile and field use

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Context-based app state management

## Project structure

```text
cropVision/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── i18n/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── ...
```

## Main routes

- `/` — landing page
- `/dashboard` — farm health overview
- `/analyze` — crop analysis flow
- `/result/:id` — diagnostic result details
- `/history` — previous scan records
- `/assistant` — advisory assistant UI
- `/fields` — field and plot management
- `/weather` — climate and forecast panel
- `/offline` — offline/local-first features
- `/settings` — app preferences and language settings

## Getting started

### Install dependencies

```bash
npm install
```

### Start the app in development mode

```bash
npm run dev
```

The app will usually run at:

```text
http://localhost:5173/
```

### Build for production

```bash
npm run build
```

### Lint the project

```bash
npm run lint
```

## Notes

This project is a front-end prototype focused on UI/UX and product flow for a modern crop monitoring platform. It includes route-based pages and reusable UI components designed for farmers working in low-connectivity environments, but it does not currently include a live ML inference backend or production data integration.

## License

This project is currently intended for local development and prototype use within the workspace.
