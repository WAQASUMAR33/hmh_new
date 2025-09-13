# Booking System Implementation

This document outlines the comprehensive booking and messaging system implemented for the marketplace platform.

## Overview

The booking system enables advertisers to request bookings from publishers, with a complete workflow from request to completion, including payment processing and messaging.

## Features Implemented

### 1. Booking Request Flow (Advertiser → Publisher)

**Model**: `Booking` with status progression:
- `PENDING` → `ACCEPTED` → `PAID` → `IN_PROGRESS` → `DELIVERED` → `COMPLETED`/`CANCELLED`

**UI Components**:
- `BookingRequestModal.js` - Form for advertisers to request bookings
- `BookingCard.js` - Display and manage individual bookings
- `BookingsPage.js` - List and filter all bookings

**API Endpoints**:
- `POST /api/bookings` - Create new booking request
- `GET /api/bookings` - List bookings (filtered by user role)
- `GET /api/bookings/[id]` - Get specific booking details
- `PATCH /api/bookings/[id]` - Update booking status

### 2. Messaging System

**Enhanced ChatModal.js**:
- Supports messages for opportunities, offers, and bookings
- Real-time conversation threads
- Automatic notifications

**API Updates**:
- `GET /api/messages` - Now supports `bookingId` parameter
- `POST /api/messages` - Can create messages for bookings

### 3. Payment Processing (Stripe Connect)

**Payment Flow**:
1. Publisher accepts booking → Status: `ACCEPTED`
2. Advertiser pays → Status: `PAID` (via Stripe)
3. Publisher delivers work → Status: `DELIVERED`
4. Advertiser approves → Status: `COMPLETED` (triggers payout)

**API Endpoints**:
- `POST /api/bookings/[id]/pay` - Create Stripe PaymentIntent
- `POST /api/webhooks/stripe` - Handle payment events

**Components**:
- `PaymentModal.js` - Payment interface
- Stripe webhook handlers for payment status updates

### 4. Fulfillment & Approvals

**Workflow**:
- Publisher marks work as `DELIVERED` (with file attachments)
- Advertiser can `APPROVE` or `DISPUTE`
- Admin override capabilities built-in

**Features**:
- File delivery system (URL-based)
- Delivery notes and comments
- Dispute handling

### 5. Availability Enforcement

**Validation**:
- Checks `availableFrom`/`availableTo` dates
- Prevents bookings outside availability windows
- Calendar integration ready

### 6. Notifications & Email

**Notification Types**:
- `BOOKING_REQUEST` - New booking request
- `BOOKING_ACCEPTED` - Booking accepted
- `BOOKING_PAID` - Payment received
- `BOOKING_DELIVERED` - Work delivered
- `BOOKING_APPROVED` - Work approved
- `BOOKING_DISPUTED` - Dispute raised

**In-app notifications** with unread counts

### 7. Admin & Moderation

**Admin Features**:
- Full access to all bookings
- Can override any booking status
- Audit trail for all changes

## Database Schema

### New Models

```prisma
model Booking {
  id                    String        @id @default(cuid())
  opportunityId         String
  advertiserId          String
  publisherId           String
  offerId               String?       // Optional: if from offer
  status                BookingStatus @default(PENDING)
  
  // Booking details
  requestedStart        DateTime
  requestedEnd          DateTime
  selectedPrice         Decimal       @db.Decimal(12, 2)
  currency              String        @default("USD")
  notes                 String?
  
  // Payment details
  stripePaymentIntentId String?
  paymentStatus         PaymentStatus @default(PENDING)
  platformFee           Decimal?      @db.Decimal(12, 2)
  publisherPayout       Decimal?      @db.Decimal(12, 2)
  
  // Delivery details
  deliveredAt           DateTime?
  deliveredFiles        Json?         // Array of file URLs
  deliveredNotes        String?
  
  // Approval details
  approvedAt            DateTime?
  approvedBy            String?
  disputeReason         String?
  
  // Relations
  opportunity           Opportunity
  advertiser            User          @relation("AdvertiserBookings")
  publisher             User          @relation("PublisherBookings")
  offer                 Offer?        @relation("OfferBookings")
  messages              Message[]
  notifications         Notification[]
}
```

### Updated Models

- `User` - Added booking relations and `stripeAccountId`
- `Message` - Added `bookingId` support
- `Notification` - Added booking notifications
- `Opportunity` - Added booking relation

## API Endpoints

### Bookings

```javascript
// Create booking request
POST /api/bookings
{
  opportunityId: string,
  offerId?: string,
  requestedStart: string, // ISO date
  requestedEnd: string,   // ISO date
  selectedPrice: string,  // Decimal
  currency?: string,
  notes?: string
}

// List bookings (filtered by user role)
GET /api/bookings?status=PENDING&search=keyword

// Get specific booking
GET /api/bookings/[id]

// Update booking status
PATCH /api/bookings/[id]
{
  action: "ACCEPT" | "REJECT" | "DELIVER" | "APPROVE" | "DISPUTE",
  deliveredFiles?: string[],
  deliveredNotes?: string,
  disputeReason?: string
}

// Create payment intent
POST /api/bookings/[id]/pay
{
  bookingId: string,
  paymentMethodId?: string
}
```

### Messages (Enhanced)

```javascript
// Get messages (now supports bookings)
GET /api/messages?bookingId=xxx

// Send message (now supports bookings)
POST /api/messages
{
  bookingId?: string,
  body: string
}
```

### Stripe Webhooks

```javascript
POST /api/webhooks/stripe
// Handles: payment_intent.succeeded, payment_intent.failed, charge.refunded
```

## Usage Examples

### Creating a Booking Request

```javascript
// Advertiser requests booking
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    opportunityId: 'opp_123',
    requestedStart: '2024-01-15T00:00:00Z',
    requestedEnd: '2024-01-22T00:00:00Z',
    selectedPrice: '500.00',
    notes: 'Please include social media promotion'
  })
});
```

### Publisher Accepting a Booking

```javascript
// Publisher accepts booking
const response = await fetch('/api/bookings/booking_123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'ACCEPT' })
});
```

### Processing Payment

```javascript
// Advertiser pays for accepted booking
const response = await fetch('/api/bookings/booking_123/pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId: 'booking_123' })
});
```

### Delivering Work

```javascript
// Publisher delivers work
const response = await fetch('/api/bookings/booking_123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'DELIVER',
    deliveredFiles: ['https://example.com/file1.pdf', 'https://example.com/file2.jpg'],
    deliveredNotes: 'All deliverables completed as requested'
  })
});
```

## Environment Variables

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (already configured)
DATABASE_URL="mysql://..."
```

## Security Features

1. **Role-based Access Control**: Users can only access their own bookings
2. **Status Validation**: Actions are only allowed in appropriate booking states
3. **Payment Security**: Stripe handles all payment processing
4. **Input Validation**: Zod schemas validate all inputs
5. **Audit Trail**: All status changes are logged

## Future Enhancements

1. **Real-time Messaging**: Integrate Pusher/Ably for live chat
2. **Calendar Integration**: Google Calendar/Outlook sync
3. **Advanced Analytics**: Booking metrics and insights
4. **Escrow System**: Enhanced payment protection
5. **Dispute Resolution**: Formal dispute handling workflow
6. **Automated Reminders**: Email/SMS notifications
7. **Bulk Operations**: Mass booking management
8. **API Rate Limiting**: Protect against abuse

## Testing

The system includes comprehensive error handling and validation:

- Invalid booking dates
- Unauthorized access attempts
- Payment failures
- Network errors
- Database constraints

All components include loading states and user feedback via toast notifications.

## Deployment Notes

1. Run database migration: `npx prisma db push`
2. Install dependencies: `npm install stripe`
3. Configure Stripe webhooks in dashboard
4. Set environment variables
5. Test payment flow in Stripe test mode

The booking system is now fully integrated and ready for production use!
