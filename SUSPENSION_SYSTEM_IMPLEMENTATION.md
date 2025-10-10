# HMH Platform - Account Suspension System Implementation

## 🎯 Overview
A comprehensive account suspension and appeal system has been implemented for both publishers and advertisers on the HMH platform. The system includes email notifications, appeal management, and proper access control.

## 🗄️ Database Schema Changes

### User Model Updates
```prisma
model User {
  // ... existing fields ...
  isSuspended             Boolean        @default(false)
  suspensionReason        String?
  suspensionDate          DateTime?
  suspendedBy             String?
  appeals                 Appeal[]       @relation("UserAppeals")
}
```

### New Appeal Model
```prisma
model Appeal {
  id                    String      @id @default(cuid())
  userId                String
  userType              String      // 'publisher' or 'advertiser'
  originalSuspensionReason String
  appealMessage         String
  status                AppealStatus @default(PENDING)
  adminResponse         String?
  responseDate          DateTime?
  respondedBy           String?
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  user                  User        @relation("UserAppeals", fields: [userId], references: [id], onDelete: Cascade)
}

enum AppealStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## 📧 Email Notification System

### Suspension Email Template
- **Trigger**: When admin suspends an account
- **Content**: 
  - Account suspension notice
  - Suspension reason
  - Appeal submission instructions
  - Direct link to appeal page
- **Styling**: Professional HTML template with HMH branding

### Appeal Response Email Template
- **Trigger**: When admin responds to an appeal
- **Content**:
  - Appeal decision (approved/rejected)
  - Admin response message
  - Next steps for the user
  - Dashboard access (if approved)

## 🔐 Authentication & Access Control

### Login Protection
- **File**: `src/app/api/login/route.js`
- **Function**: Checks `isSuspended` field during login
- **Behavior**: 
  - Suspended users receive 403 status
  - Redirected to appropriate suspended page
  - Prevents dashboard access

### Suspension Check API
- **Endpoint**: `/api/auth/suspension-check`
- **Purpose**: Verify user suspension status
- **Returns**: User details and suspension information

## 🚫 Suspended Account Pages

### Publisher Suspended Page
- **Path**: `/publisher/suspended`
- **Features**:
  - Suspension details display
  - Appeal submission form
  - Professional UI with clear messaging
  - Logout functionality

### Advertiser Suspended Page
- **Path**: `/advertiser/suspended`
- **Features**: Same as publisher page, tailored for advertisers

### Generic Suspended Page
- **Path**: `/suspended`
- **Purpose**: Handles login redirects for suspended users
- **Features**: Auto-detects user type and provides appropriate interface

## 📝 Appeal System

### Appeal Submission
- **API**: `POST /api/appeals`
- **Validation**:
  - User must be suspended
  - No duplicate pending appeals
  - Required fields validation
- **Storage**: Creates appeal record in database

### Appeal Management
- **API**: `PUT /api/appeals/[id]`
- **Actions**:
  - Approve appeal (unsuspends user)
  - Reject appeal (maintains suspension)
- **Notifications**: Sends response email to user

## 👨‍💼 Admin Management Interface

### Publisher Management
- **Path**: `/admin/publishers`
- **Features**:
  - Suspend/unsuspend publishers
  - Real-time API integration
  - Email notifications on suspension
  - Status tracking

### Advertiser Management
- **Path**: `/admin/advertisers`
- **Features**: Same functionality as publisher management

### Appeals Management
- **Path**: `/admin/appeals`
- **Features**:
  - View all appeals
  - Filter by status and user type
  - Approve/reject appeals
  - Response management
  - Email notifications

## 🔄 Complete Workflow

### 1. Account Suspension
```
Admin → Suspend Account → API Call → Database Update → Email Sent → User Notified
```

### 2. User Login Attempt
```
User → Login → Suspension Check → Redirect to Suspended Page → Appeal Option
```

### 3. Appeal Process
```
User → Submit Appeal → Admin Review → Decision → Email Response → Status Update
```

### 4. Appeal Approval
```
Admin → Approve Appeal → User Unsuspended → Email Notification → Dashboard Access Restored
```

## 🛡️ Security Features

- **Access Control**: Suspended users cannot access dashboards
- **Validation**: Prevents duplicate appeals and invalid submissions
- **Authentication**: All admin actions require proper authentication
- **Audit Trail**: Tracks who suspended users and when
- **Email Verification**: All notifications sent to verified email addresses

## 📁 File Structure

```
src/app/
├── api/
│   ├── admin/
│   │   └── suspend-user/route.js          # Suspension API
│   ├── appeals/
│   │   ├── route.js                       # Appeal CRUD
│   │   └── [id]/route.js                  # Appeal responses
│   ├── auth/
│   │   └── suspension-check/route.js      # Suspension verification
│   └── login/route.js                     # Updated login with suspension check
├── admin/
│   ├── publishers/page.js                 # Publisher management
│   ├── advertisers/page.js                # Advertiser management
│   └── appeals/page.js                    # Appeals management
├── publisher/
│   └── suspended/page.js                  # Publisher suspended page
├── advertiser/
│   └── suspended/page.js                  # Advertiser suspended page
├── suspended/page.js                      # Generic suspended page
└── lib/
    └── email.js                           # Email templates and functions
```

## 🧪 Testing

### Test Endpoint
- **Path**: `/api/debug/test-suspension`
- **Purpose**: Verify suspension system functionality
- **Returns**: Test user data and system status

### Manual Testing Steps
1. Create a test user (publisher or advertiser)
2. Login as admin and suspend the user
3. Verify email notification is sent
4. Attempt to login as suspended user
5. Verify redirect to suspended page
6. Submit an appeal
7. Review appeal as admin
8. Approve/reject appeal
9. Verify email response is sent
10. Test dashboard access after approval

## 🚀 Deployment Notes

1. **Database Migration**: Run `npx prisma db push` to apply schema changes
2. **Prisma Client**: Run `npx prisma generate` to update client
3. **Email Configuration**: Ensure email environment variables are set
4. **Testing**: Use the debug endpoint to verify system functionality

## 📋 Environment Variables Required

```env
# Email Configuration
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@hmh.com
NEXTAUTH_URL=http://localhost:3000
```

## ✅ Implementation Status

- [x] Database schema updates
- [x] Email notification system
- [x] Login protection
- [x] Suspended account pages
- [x] Appeal submission system
- [x] Admin management interfaces
- [x] Appeal management system
- [x] Email response templates
- [x] Security validations
- [x] Testing endpoints

The suspension system is now fully functional and ready for production use!
