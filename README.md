# 🚀 AWS Toolkit

A productivity toolkit built for Amazon Connect user administration workflows.

AWS Toolkit streamlines repetitive user-management tasks by providing bulk actions, routing profile automation, and agent selection utilities through a lightweight Tampermonkey userscript.

---

## ✨ Features

### User Management

- 📥 Add user emails directly from clipboard
- 📋 View stored user list
- ✅ Bulk select users
- ❌ Bulk deselect users
- 🧹 Clear stored users

### Routing Profile Automation

Apply routing profiles with a single click:

- Driver Chat Focus
- Driver Default Omnichannel
- Driver Email Focus
- Driver Voice Focus

### User Experience

- 🎨 Modern floating interface
- 🖱️ Draggable panel
- 💾 Remembers last selected routing profile
- 🔔 Visual status notifications
- ⚡ Lightweight and fast

---

## 📸 Preview

![AWS](https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/refs/heads/main/screenshots/aws-toolkit-v2.png)
---

## 🛠 Technologies

- JavaScript (ES6+)
- Tampermonkey
- DOM Automation
- Browser Storage (localStorage)
- Amazon Connect UI Automation

---

## 🚀 Installation

### 1. Install Tampermonkey Extension

https://www.tampermonkey.net/

See:
- screenshots/install-tampermonkey.mp4

### 2. Install AWS Toolkit

Open:

https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js

Tampermonkey will detect the userscript automatically.

![AWS](https://github.com/Mkhimer69/aws-toolkit/blob/main/screenshots/install%20AWS%20toolkit.gif?raw=true)


### 3. Install

Click **Install**.

### 4. Refresh Amazon Connect

The toolkit will load automatically.

---
## 🎥 Video Guides

### Install Tampermonkey

See:
- screenshots/install-tampermonkey.mp4

### AWS Toolkit Demo

See:
- screenshots/aws-toolkit-demo.mp4

### AWS Toolkit V3 Live bridge

See:
- screenshots/live-bridge-demo.mp4
  
## 🔄 Updates

AWS Toolkit supports automatic updates through Tampermonkey.

When a new version is published:

- Tampermonkey checks for updates automatically
- Users receive an update notification
- One-click update installation

---

## 📌 Use Cases

- Agent onboarding
- Routing profile changes
- Bulk user administration
- Operations workflow optimization
- Contact center administration

---
## 🆕 What's New in Version 3.0



### ⚡ Live Bridge System
Added a real-time bridge between the Amazon Connect Analytics Dashboard and User Administration pages, enabling seamless data sharing between both environments.

### 🎲 Random Agent Injection
Select a routing profile and automatically inject a specified number of randomly selected agents directly into the toolkit's user stash for bulk actions.

### 📡 Analytics Synchronization
Agent data is automatically synchronized between AWS pages without the need for manual exports, imports, or copy-paste operations.

### 📊 Progress Tracking
Introduced visual progress bars and live status updates for bulk user selection and management tasks.

### 🔔 Desktop Notifications
Receive browser notifications when long-running operations complete, allowing you to continue working without monitoring the toolkit.

### 🚀 Performance Improvements
Optimized bulk selection and deselection workflows to reduce delays and improve responsiveness across large user lists.

### 🎨 UI Enhancements
Enhanced the toolkit interface with better status indicators, synchronization timestamps, and an improved Live Bridge Picker experience.

---
## 👨‍💻 Author

**Fathy Mkhimer**

Lead Real-Time Analyst

GitHub:
https://github.com/Mkhimer69

---

## ⚠ Disclaimer

This project was created for productivity and workflow automation purposes.

Always test changes in accordance with your organization's policies and change-management procedures.
