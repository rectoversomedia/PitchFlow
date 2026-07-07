# PitchFlow API Documentation

## Overview

All API endpoints require authentication via NextAuth session. Unauthenticated requests will receive a `401 Unauthorized` response.

## Base URL

```
Production: https://pitchflow.vercel.app
Development: http://localhost:3000
```

## Authentication

All API routes (except `/api/auth/*`) require a valid NextAuth session. The session is automatically handled by NextAuth through HTTP-only cookies.

### Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Validation Error:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": ["Error message"]
  }
}
```

---

## Briefs API

### GET /api/briefs

Fetch all briefs for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "brand_name": "Brand Name",
      "pic_sales": "Sales PIC Name",
      "program": "Program Name",
      "status": "new",
      "created_at": "2024-01-01T00:00:00Z",
      ...
    }
  ]
}
```

### POST /api/briefs

Create a new brief.

**Request Body:**
```json
{
  "brand_name": "Required - Brand name",
  "pic_sales": "Required - Sales PIC",
  "program": "Required - Program name",
  "industry_category": "Optional",
  "pic_contact": "Optional",
  "sponsorship_type": "Optional",
  "objective": "Optional",
  "target_audience": "Optional",
  "period": "Optional",
  "deadline": "Optional - YYYY-MM-DD",
  "budget_range": "Optional",
  "budget_note": "Optional",
  "notes": "Optional",
  "attachments": ["Optional - array of URLs"]
}
```

**Response:** `201 Created`

### PUT /api/briefs

Update an existing brief.

**Request Body:** Same as POST, but `id` is required.

### DELETE /api/briefs?id={id}

Delete a brief.

---

## Proposals API

### GET /api/proposals

Fetch all proposals for the authenticated user.

### POST /api/proposals

Create a new proposal.

**Request Body:**
```json
{
  "title": "Required - Proposal title",
  "brand_name": "Required - Brand name",
  "pic_sales": "Required - Sales PIC",
  "program": "Optional",
  "industry": "Optional",
  "sponsorship_type": "Optional",
  "year": "Optional - number",
  "status": "Optional - new_brief|drafting|need_input|revised|ready",
  "brief_id": "Optional - UUID",
  "result": "Optional - won|pitched|lost|template",
  "deadline": "Optional",
  "slides_count": "Optional - number"
}
```

### PUT /api/proposals

Update an existing proposal.

### DELETE /api/proposals?id={id}

Delete a proposal.

---

## Clients API

### GET /api/clients

Fetch all clients for the authenticated user.

### POST /api/clients

Create a new client.

**Request Body:**
```json
{
  "name": "Required - Contact name",
  "brand_name": "Optional",
  "email": "Optional",
  "phone": "Optional",
  "company": "Optional",
  "industry": "Optional",
  "address": "Optional",
  "notes": "Optional"
}
```

### PUT /api/clients

Update an existing client.

### DELETE /api/clients?id={id}

Delete a client.

---

## Events API

### GET /api/events

Fetch all events for the authenticated user.

### POST /api/events

Create a new event.

**Request Body:**
```json
{
  "title": "Required - Event title",
  "event_date": "Required - YYYY-MM-DD",
  "description": "Optional",
  "event_time": "Optional - HH:MM",
  "event_type": "Optional - deadline|meeting|milestone|presentation|other",
  "proposal_id": "Optional - UUID",
  "brief_id": "Optional - UUID",
  "client_id": "Optional - UUID",
  "reminder": "Optional - boolean",
  "reminder_days_before": "Optional - number"
}
```

### PUT /api/events

Update an existing event.

### DELETE /api/events?id={id}

Delete an event.

---

## Sales Comments API

### GET /api/sales-comments

Fetch all comments for the authenticated user.

### POST /api/sales-comments

Create a new comment.

**Request Body:**
```json
{
  "proposal_id": "Required - UUID",
  "content": "Required - Comment text",
  "parent_id": "Optional - UUID (for replies)"
}
```

### DELETE /api/sales-comments?id={id}

Delete a comment (only own comments).

---

## AI API

### POST /api/ai

Access AI-powered features. Requires authentication.

**Request Body:**
```json
{
  "action": "brandDNA|analyzeBrand|generateIdeas|generateProposal|searchReference|improveText|trendAnalysis|audienceInsights|calculateROI",
  "params": { ... }
}
```

**Actions:**

| Action | Required Params |
|--------|---------------|
| `brandDNA` | `brandName`, `industry` |
| `analyzeBrand` | `brandName`, `industry` |
| `generateIdeas` | `brandName`, `industry`, `programType` |
| `generateProposal` | `brandName`, `programName`, `objective` |
| `searchReference` | `topic` |
| `improveText` | `text` |
| `trendAnalysis` | - |
| `audienceInsights` | - |
| `calculateROI` | `budget`, `program` |

**Rate Limit:** 20 requests per minute per user.

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

| Endpoint | Limit |
|---------|-------|
| `/api/ai` | 20 requests/minute |
| `/api/auth/*` | 10 requests/minute |
| Other API routes | 100 requests/minute |

When rate limited, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Not authenticated |
| `403` | Forbidden - Not authorized to access resource |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

---

## Support

For API issues or questions, contact support@rectoverso.com
