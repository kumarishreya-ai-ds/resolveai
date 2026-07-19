# Technical Report

## Project Overview

ResolveAI is an autonomous customer resolution platform that uses a multi-agent architecture to streamline the full support lifecycle. The application combines customer context, policy retrieval, sentiment analysis, and escalation logic into a single workflow.

## Problem Statement

Support teams often face slow resolution cycles because agents must manually interpret messages, search policies, draft replies, and decide when to escalate. This creates operational inefficiency and inconsistent customer experiences.

## Solution

ResolveAI introduces a structured AI orchestrator with specialized agents for each stage of the support process. This improves consistency, reduces manual work, and gives support managers better visibility into customer issues.

## Architecture

The system is split into a React frontend and an Express backend. The backend integrates MongoDB for persistence, OpenAI for response generation, and a knowledge retrieval layer for policy-backed answers.

## Workflow

1. A customer message is submitted from the frontend.
2. The backend orchestrator starts a workflow instance.
3. Intent, sentiment, customer, and knowledge agents gather context.
4. The resolution agent drafts a reply.
5. The escalation agent determines whether human review is needed.
6. The platform returns a resolution summary, ticket output, and analytics-ready metadata.

## Tech Stack

- React
- Vite
- Express.js
- MongoDB
- Mongoose
- OpenAI API
- Tailwind CSS
- Chart.js
- Framer Motion

## Database Design

### Users

Stores authentication credentials and role information.

### Customers

Stores customer identity, status, tier, and support history.

### Tickets

Stores issue title, category, priority, status, escalation details, and assignment data.

### Conversations

Stores customer interactions and message timelines.

## API Flow

The frontend communicates with the backend through `src/services/api.js`.

Important endpoint groups:

- Authentication: `/api/auth`
- Customers: `/api/customers`
- Tickets: `/api/tickets`
- Conversations: `/api/conversations`
- AI: `/api/ai`
- Analytics: `/api/analytics`
- Knowledge: `/api/knowledge`

## Challenges

- Maintaining consistent results across multi-step AI workflows
- Supporting fallback logic when AI services are unavailable
- Keeping knowledge retrieval aligned with policy documents
- Presenting operational insights in a simple dashboard format

## Future Scope

- Real-time support handoff
- More advanced reporting and SLA analytics
- Notification automation
- External CRM integration
- Multi-language support
- Improved confidence calibration and agent memory