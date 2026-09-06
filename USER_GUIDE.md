# 🚀 AWS Toolkit User Guide

AWS Toolkit helps automate Amazon Connect user administration workflows by providing bulk user actions, routing profile automation, and live agent synchronization tools.

---

# Getting Started

## Opening AWS Toolkit

1. Open the Amazon Connect **Users** page.
2. Wait for the page to fully load.
3. AWS Toolkit will appear automatically on the right side of the screen.

Example:

🚀 AWS Toolkit v3

---

# Feature 1: Add Users

Use this feature to build a list of users for bulk actions.

## Steps

1. Copy one or more email addresses to your clipboard.

Example:

john.doe@example.com

2. Click:

📥 Add

3. AWS Toolkit will automatically detect and save the email addresses.

4. A confirmation message appears.

Example:

✅ Saved

or

✅ Added 5 emails

## Notes

- Duplicate emails are automatically ignored.
- Emails are stored locally in your browser.
- Multiple emails can be added simultaneously.

---

# Feature 2: Show Stored Users

View all users currently stored in AWS Toolkit.

## Steps

Click:

📋 Show

The stored email list will appear below the action buttons.

## Example

john.doe@example.com

jane.smith@example.com

mark.jones@example.com

---

# Feature 3: Select Users

Bulk-select users from the stored email list.

## Steps

1. Add users using 📥 Add.
2. Click:

✅ Select

3. AWS Toolkit will:

- Search each email
- Locate the matching user
- Automatically select the checkbox

## Progress Updates

Examples:

Selecting 1/10

Selecting 5/10

Selecting 10/10

Done

## Completion Notification

A desktop notification will appear when processing completes.

Example:

AWS Toolkit Task Completed

Successfully processed 10 agents.

---

# Feature 4: Deselect Users

Bulk-deselect users from the stored email list.

## Steps

1. Add users using 📥 Add.
2. Click:

❌ Deselect

AWS Toolkit will automatically remove the selected checkboxes.

---

# Feature 5: Live Bridge Picker (New in v3)

The Live Bridge Picker allows administrators to pull agents directly from Amazon Connect Analytics Dashboard and automatically load them into AWS Toolkit.

This removes the need to manually search for agents or copy email addresses.

---

## How Live Bridge Works

### Step 1

Open the Amazon Connect Analytics Dashboard.

AWS Toolkit automatically captures live agent data and stores it locally.

### Step 2

Open the Amazon Connect Users page.

AWS Toolkit will automatically detect the latest synchronized data.

### Step 3

Locate the:

⚡ Live Bridge Picker

section inside AWS Toolkit.

### Step 4

Select the number of agents to pull.

Example:

Pick: 5

### Step 5

Select a routing profile from the dropdown.

Example:

Driver Chat Focus

### Step 6

Click:

⚡ Inject into Tool Stash

### Result

AWS Toolkit will:

- Filter agents from the selected routing profile
- Randomly select the requested number of agents
- Add them to the stored user list
- Remove duplicates automatically

Example:

✅ Injected 5 random agents from Driver Chat Focus

---

# Feature 6: Analytics Synchronization

AWS Toolkit continuously synchronizes data from the Analytics Dashboard.

## Available Data

- Agent Name
- Agent Email
- Routing Profile
- Agent State
- State Duration
- Active Slots
- Capacity

## Sync Status

The Live Bridge section displays:

Sync: 10:35:12 AM

showing the most recent synchronization time.

---

# Feature 7: Routing Profile Management

Apply routing profiles automatically to selected users.

## Supported Profiles

### Driver

- Driver Chat Focus
- Driver Default Omnichannel
- Driver Email Focus
- Driver Voice Focus
- Driver Nesting - Chat
- Driver Nesting - Email

### Rider

- Rider Chat Single Concurrency
- Rider Email
- Rider Omnichannel

### Safety

- Safety Chat - Training
- Safety Email - Training
- Safety General
- Safety SMAA AST Sutherland
- Safety SMAA Sutherland

### Supervisor

- Supervisor - Sutherland

---

## Applying a Routing Profile

### Step 1

Select one or more users.

### Step 2

Choose a routing profile.

Example:

Safety General

### Step 3

Click:

🚀 Apply Profile

### Step 4

Wait for completion.

Example:

Applying Safety General...

✅ Applied

## Notification

A desktop notification will appear when the profile update is completed.

Example:

Profile Applied Successfully

Routing Profile: Safety General

---

# Feature 8: Progress Tracking

AWS Toolkit includes a visual progress bar for bulk operations.

The progress bar appears automatically during:

- User selection
- User deselection

This helps track completion status for larger user lists.

---

# Feature 9: Desktop Notifications

AWS Toolkit supports browser notifications.

Notifications are displayed when:

- Bulk actions complete
- Routing profiles are successfully applied

Examples:

🔔 AWS Toolkit Task Completed

🔔 Profile Applied Successfully

---

# Feature 10: Clear Stored Users

Removes all stored email addresses from AWS Toolkit.

## Steps

Click:

🧹 Clear

Confirmation:

✅ Cleared

---

# Collapsing AWS Toolkit

Click:

−

in the top-right corner of the toolkit window.

The panel will collapse.

Click:

+

to expand it again.

---

# Moving AWS Toolkit

Click and hold the blue toolkit header.

Drag the panel to any location on the screen.

---

# Troubleshooting

## "No Emails"

### Cause

No users have been added to the toolkit.

### Solution

Use:

📥 Add

or

⚡ Inject into Tool Stash

before running bulk actions.

---

## "Search Box Not Found"

### Cause

Amazon Connect did not fully load.

### Solution

Refresh the page and try again.

---

## "No Active Live Data Found"

### Cause

Analytics Dashboard has not synchronized data yet.

### Solution

1. Open Analytics Dashboard.
2. Wait for data to load.
3. Return to the Users page.

---

## "No Active Agents Found"

### Cause

No agents currently match the selected routing profile.

### Solution

Try another routing profile or wait for live data to refresh.

---

## "Routing Profile Not Found"

### Cause

The selected routing profile may not exist or the page is still loading.

### Solution

1. Wait a few seconds.
2. Try again.
3. Refresh the page if necessary.

---

# Recommended Workflow

## Using Clipboard Emails

1. Copy user emails.
2. Click 📥 Add.
3. Click ✅ Select.
4. Choose a routing profile.
5. Click 🚀 Apply Profile.
6. Verify the update.
7. Click 🧹 Clear.

## Using Live Bridge

1. Open Analytics Dashboard.
2. Allow synchronization to complete.
3. Open Users page.
4. Select a routing profile.
5. Choose agent count.
6. Click ⚡ Inject into Tool Stash.
7. Click ✅ Select.
8. Click 🚀 Apply Profile.
9. Verify the update.
10. Click 🧹 Clear.

---

# Version

Current Version:

AWS Toolkit v3.0

---

# Maintainer

**Fathy Mkhimer**

Lead Real-Time Analyst

GitHub:

https://github.com/Mkhimer69

For issues, feature requests, or enhancement suggestions, please contact the maintainer.

---
