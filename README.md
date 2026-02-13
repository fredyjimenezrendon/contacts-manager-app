# Contacts Manager

Angular application for managing contacts, built with Angular 21, server-side rendering, and deployed to Vercel.

🔗 **Live:** [contacts-manager-app-six.vercel.app](https://contacts-manager-app-six.vercel.app) | 📦 **Repo:** [github.com/fredyjimenezrendon/contacts-manager-app](https://github.com/fredyjimenezrendon/contacts-manager-app)

## Features

- Create, view, edit, and delete contacts
- Paginated contact list
- Reactive form validation (required fields, email format, phone pattern)
- Server-side rendering (SSR) with hydration
- Lazy-loaded routes for optimized bundle size
- Responsive design

## Tech Stack

- **Angular 21** with standalone components and signals
- **SSR** via `@angular/ssr` + Express
- **Vercel** for deployment (serverless functions)
- **GitHub Actions** for backend keep-alive cron job

## Prerequisites

- Node.js 22+
- npm 10+

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (with SSR)
npm start
```

The app will be available at `http://localhost:4200`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build (browser + server) |
| `npm test` | Run unit tests |
| `npm run serve:ssr:contacts-manager` | Serve the production SSR build locally |

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── contact-list/        # Paginated list with delete
│   │   ├── contact-detail/      # View contact info
│   │   └── contact-form/        # Create and edit form
│   ├── models/
│   │   └── contact.model.ts     # Contact and PagedResponse interfaces
│   ├── services/
│   │   └── contact.service.ts   # API client (CRUD operations)
│   ├── app.routes.ts            # Route definitions (lazy-loaded)
│   ├── app.routes.server.ts     # SSR render mode config
│   ├── app.config.ts            # App providers (HttpClient, Router)
│   └── app.config.server.ts     # Server-specific providers
├── environments/                # API base URL config
├── server.ts                    # Express SSR server
└── styles.css                   # Global styles and CSS variables
api/
└── index.js                     # Vercel serverless function entry
.github/
└── workflows/
    └── keep-alive.yml           # Pings backend every 10 min
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | ContactList | Paginated contact list |
| `/contacts/new` | ContactForm | Create a new contact |
| `/contacts/:id` | ContactDetail | View contact details |
| `/contacts/:id/edit` | ContactForm | Edit an existing contact |

## API

The app consumes a REST API at `https://contacts-manager-backend-74tf.onrender.com/api/v1`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts?page=0&size=10` | List contacts (paginated) |
| POST | `/contacts` | Create a contact |
| GET | `/contacts/{id}` | Get contact by ID |
| PUT | `/contacts/{id}` | Update a contact |
| DELETE | `/contacts/{id}` | Delete a contact |

API docs: [Swagger UI](https://contacts-manager-backend-74tf.onrender.com/swagger-ui/index.html)

## Deployment

### Vercel

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will auto-detect Angular and use the configuration in `vercel.json`

The `vercel.json` routes all requests through a serverless function (`api/index.js`) that invokes the Angular SSR server.

### Backend Keep-Alive

The backend (hosted on Render free tier) sleeps after 10 minutes of inactivity. A GitHub Actions workflow (`.github/workflows/keep-alive.yml`) pings the API every 10 minutes to prevent this. It activates automatically once the repo is pushed to GitHub.
