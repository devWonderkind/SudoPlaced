# API Documentation

## Authentication (`accounts`)
- `POST /api/auth/jwt/create/` - Login (Get Tokens)
- `POST /api/auth/jwt/refresh/` - Refresh Token
- `POST /api/auth/users/` - Register
- `GET /api/auth/users/me/` - Get Current User Profile

## Applications (`applications`)
- `GET /api/applications/` - List all job applications
- `POST /api/applications/` - Create new job application
- `GET /api/applications/{id}/` - Retrieve application details
- `PATCH /api/applications/{id}/` - Update application details (status, notes, dynamic assets)
- `DELETE /api/applications/{id}/` - Delete application

### Sub-resources
- `GET /api/applications/{id}/history/` - Get status history logs for an application
- `POST /api/applications/{id}/notes/` - Create a note linked to this application
- `GET /api/applications/{id}/notes/` - Get notes linked to this application

### General Notes
- `GET /api/keynotes/` - List all General/Pinned notes
- `POST /api/keynotes/` - Create a standalone note
- `PATCH /api/keynotes/{id}/` - Update note content (JSON blocks or Markdown)
- `DELETE /api/keynotes/{id}/` - Delete note

## Directory (`directory`)
- `GET /api/directory/contacts/` - List professional contacts
- `POST /api/directory/contacts/` - Add new professional contact
- `GET /api/directory/contacts/{id}/` - Get contact details
- `PATCH /api/directory/contacts/{id}/` - Update contact info
- `DELETE /api/directory/contacts/{id}/` - Remove contact

## Notifications (`notifications`)
- `GET /api/notifications/` - List notifications (System, Reminders, Broadcasts)
- `POST /api/notifications/{id}/mark_read/` - Mark a specific notification as read
- `POST /api/notifications/mark_all_read/` - Mark all user notifications as read

---

# Detailed API Reference (V3 Implementation)

## 1. Directory & Contacts
**Base Endpoint:** `/api/directory/contacts/`

| Method | Endpoint | Description | Permissions |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List all contacts. Returns **Lightweight** objects. Includes your private contacts + Public/Platform-wide contacts. | Owner + Public |
| `POST` | `/` | Create a new **Private** professional contact. | Authenticated |
| `GET` | `/{id}/` | Retrieve full contact details (including notes/socials). | Owner + Public |
| `PUT/PATCH` | `/{id}/` | Update contact details. | **Owner Only** |
| `DELETE` | `/{id}/` | Delete a contact. | **Owner Only** |

**Filtering:**
- `?company={name}`
- `?privacy_status={Public|Private}`
- `?search={query}` (searches name, company, email)

---

## 2. Job Applications & Tracking
**Base Endpoint:** `/api/applications/`

| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List applications (Lightweight). | Now includes `priority_order` for Kanban Swimlane sorting. |
| `POST` | `/` | Create application. | `status` field now expects a **Status ID** (or leave blank for default). |
| `GET` | `/{id}/` | Retrieve full details. | `status` is an ID; `status_label` provides the name. |
| `GET` | `/{id}/history/` | specific history logs. | Returns status change timeline. |
| `PUT/PATCH` | `/{id}/` | Update application. | Status changes automatically trigger history logging. |
| `DELETE` | `/{id}/` | **Soft Delete** application. | Sets `is_deleted=True`. |

**Sub-Feature: Kanban Statuses (Columns)**
**Base Endpoint:** `/api/statuses/`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all your custom statuses (Columns). | Ordered by `order`. |
| `POST` | `/` | Create a new custom status column. |
| `POST` | `/reorder/` | Bulk reorder columns. Payload: `[{id: 1, order: 0}, {id: 2, order: 1}]` |

**Filtering:**
- `?status={id}` (Filter by Status ID)
- `?work_mode={Remote|Hybrid|...}`
- `?role_title={string}`
- `?company_name={string}`

**Linking Contacts:**
To link contacts during Create/Update, pass `hr_contact_ids`: `[1, 2, 5]`.
> **Constraint:** You can only link contacts created by **you** OR contacts marked as **Public**.

---

## 3. Notes (KeyNotes)
**Base Endpoint:** `/api/notes/`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all notes. |
| `POST` | `/` | Create a note. Link to app via `application_id`. |
| `GET` | `/{id}/` | Get note content (JSON/Markdown). |

**Filtering:**
- `?application={app_id}` - Get notes for a specific job.
- `?is_pinned=true` - Get pinned notes.

---

## 4. Notifications
**Base Endpoint:** `/api/notifications/notifications/`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List your notifications. Ordered by newest. |
| `POST` | `/` | Create a notification (Only type `Job_Reminder` allowed). |
| `POST` | `/{id}/mark_read/` | Mark specific notification as read. |
| `POST` | `/mark_all_read/` | Bulk mark all as read. |

**Filtering:**
- `?is_read={true|false}`
- `?notification_type={System|Job_Reminder|...}`

---

## 5. Frontend Reference: Constants & Enums

### Job Application

**Status Choices (Dynamic):**
Statuses are now fully customizable. Fetch `GET /api/statuses/` to get the current user's columns.
**Default Statuses (Created on Sign-up):**
- `Bookmarked` (Order: 0)
- `Applied` (Order: 1)
- `Assessment` (Order: 2)
- `Interviewing` (Order: 3)
- `Offered` (Order: 4)
- `Rejected` (Order: 5)
- `Ghosted` (Order: 6)

**Work Mode (`work_mode`):**
- `Remote`
- `Hybrid`
- `On-site`

### Professional Contact

**Privacy Status (`privacy_status`):**
| Value | Description |
| :--- | :--- |
| `Private` | Visible only to you (Default). |
| `Public` | Visible to all platform users. |
| `Public_Pending` | Submitted for public approval. |

### Notifications

**Notification Types (`notification_type`):**
| Value | User Action | Description |
| :--- | :--- | :--- |
| `Job_Reminder` | **Createable** | Personal reminders for applications. |
| `System` | Read-only | Automated system alerts. |
| `Admin_Broadcast` | Read-only | Announcements from admins. |
| `Milestone` | Read-only | Achievement unlocked! |
