# 🗺️ Backend Integration Blueprint

This document outlines the detailed 10-phase plan to integrate the **ArtFolio** frontend with the FastAPI backend. It ensures a structured, secure, and scalable integration following the specific requirements for JWT authentication and component architecture.

---

## 🛠️ Phase 1: Infrastructure & Configuration

- **Goal**: Set up the frontend to communicate with the backend.
- **Steps**:
    1. **Environment Setup**:
        - Define `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` in `.env.local`.
    2. **Type Definitions**:
        - Create `types/api.ts` to mirror backend Pydantic models (User, Artwork, Token, etc.).
    3. **Endpoints Configuration**:
        - Create `src/lib/endpoints.ts` to centralize all API URLs.
        - Export constants for Auth, Account, Users, and Artworks endpoints.

## 🔐 Phase 2: Authentication Actions & Core Logic

- **Goal**: Implement login and registration with Server Actions.
- **Steps**:
    1. **Action Setup**:
        - Create `src/actions/auth_action.ts`.
    2. **Registration**:
        - Implement `registerUser` action calling `POST /auth/register`.
    3. **Login**:
        - Implement `loginUser` action calling `POST /auth/login`.
        - **Crucial**: Capture `access_token`, `refresh_token`, and **`username`** from the response.
        - Store tokens securely (HTTP-only cookies recommended for Next.js, or local storage if client-side only).

## 🔄 Phase 3: Advanced JWT Token Strategy

- **Goal**: Implement the robust token refresh mechanism as requested.
- **Steps**:
    1. **Refresh Logic**:
        - Implement `refreshToken` function calling `POST /auth/refresh`.
    2. **Interval Refresh**:
        - Set up a `useEffect` or utility to trigger a silent token refresh every **20 minutes**.
    3. **On-Load Refresh**:
        - Ensure that whenever the application loads (or a layout mounts), a refresh token call is attempted immediately to validate the session.
    4. **Interceptors**:
        - Configure global fetch wrappers (e.g., using `axios` or custom `fetch` wrapper) to attach `Authorization: Bearer <token>` to requests.

## 👤 Phase 4: Global State & User Context

- **Goal**: Manage user state across the application.
- **Steps**:
    1. **User Context**:
        - Create `providers/AuthProvider.tsx`.
    2. **State Management**:
        - Store the authenticated `username` in the global state/context.
    3. **Navbar Integration**:
        - Connect the Navbar to the Auth Context.
        - **Requirement**: Display the logged-in `username` in the Navbar (next to the logo or profile icon).

## 🛠️ Phase 5: Account Management Actions

- **Goal**: Enable users to manage their private profiles.
- **Steps**:
    1. **Action Setup**:
        - Create `src/actions/accounts_action.ts`.
    2. **Fetch Details**:
        - Implement `getAccountDetails` calling `GET /account-details`.
    3. **Update Profile**:
        - Implement `updateAccountDetails` calling `PATCH /account-details`.
        - Handle `multipart/form-data` for image uploads.
    4. **Deactivation**:
        - Implement `deactivateAccount` calling `PATCH /account-details/deactivate`.

## 🌍 Phase 6: Public User Discovery

- **Goal**: Allow users to browse the community.
- **Steps**:
    1. **Action Setup**:
        - Create `src/actions/users_action.ts`.
    2. **Listing**:
        - Implement `getUsers` calling `GET /users`.
    3. **Search**:
        - Implement `searchUsers` calling `GET /users/search`.
    4. **UI Integration**:
        - Connect `Discover Artists` page to these actions.

## 🎨 Phase 7: Artwork Feed & Discovery

- **Goal**: Integrate the main artwork showcase.
- **Steps**:
    1. **Action Setup**:
        - Create `src/actions/artworks_action.ts`.
    2. **Feed**:
        - Implement `getArtworks` calling `GET /artworks`.
    3. **Search**:
        - Implement `searchArtworks` calling `GET /artworks/search`.
    4. **UI Integration**:
        - Connect the Home/Explore page Masonry grid to backend data.

## 🖌️ Phase 8: Artwork Creation & Management

- **Goal**: Enable artists to upload and manage work.
- **Steps**:
    1. **Upload**:
        - Implement `createArtwork` in `artworks_action.ts` calling `POST /artworks`.
        - Ensure correct `FormData` handling for files.
    2. **Update**:
        - Implement `updateArtwork` calling `PATCH /artworks/{id}`.
    3. **Delete**:
        - Implement `deleteArtwork` calling `DELETE /artworks/{id}`.

## 🖼️ Phase 9: Detailed Views & Profiles

- **Goal**: Comprehensive views for Users and Artworks.
- **Steps**:
    1. **Artwork Details**:
        - Implement `getArtworkById` calling `GET /artworks/{id}`.
        - Create Dynamic Route `app/artworks/[id]/page.tsx`.
    2. **Public Profiles**:
        - Implement `getUserProfile` calling `GET /users/{username}`.
        - Implement `getUserArtworks` calling `GET /users/{userId}/artworks`.
        - Create Dynamic Route `app/artist/[username]/page.tsx`.

## 🚀 Phase 10: Finalization & Polish

- **Goal**: Ensure a smooth, error-free user experience.
- **Steps**:
    1. **Error Handling**:
        - Implement global toast notifications for API success/error states.
    2. **Loading States**:
        - Add skeleton loaders during data fetching.
    3. **Redirects**:
        - Protect private routes (e.g., `/upload`, `/profile`) with middleware or client-side checks.
    4. **Verification**:
        - End-to-end testing of the "Register -> Login -> Upload -> View" flow.

## ✨ Phase 11: Application Refinement & Account Redesign

- **Goal**: Enhance user experience with a modern, responsive Account management interface.
- **Steps**:
    1. **Account Page Redesign**:
        - Implemented a grid layout with a sticky Profile Sidebar and modular Info Cards.
        - Created dialog-based forms for editing Name, Bio, and Profile Image.
    2. **Global State Sync**:
        - Exposed `updateUser` in `AuthProvider` to instantly reflect profile changes (like avatar updates) in the Navbar.
    3. **UI Enhancements**:
        - Added Page Utilities (Refresh, Scroll to Top).
        - Implemented a global scroll progress indicator.

## ⚡ Phase 12: Performance & Optimization

- **Goal**: Optimize data loading and asset handling for a seamless experience.
- **Steps**:
    1. **Infinite Scroll**:
        - Implemented `ArtworkInfiniteScroll` component for the Explore page.
        - Updated `getArtworks` to support `skip` and `limit` pagination.
    2. **Masonry Layout Logic**:
        - Refactored `ImageMosaic` to use a sequential column distribution (`index % columns`).
        - Implemented smart staggered animations (normalized delays) to prevent "blank screen" issues on long lists.
    3. **Image Optimization**:
        - Configured `unoptimized` prop for external images (Unsplash) to bypass Next.js default limit.
        - Added client-side validation (max 4MB) for profile image uploads.

## 🐛 Phase 13: Bug Catching & Stability

- **Goal**: Identify and resolve critical integration issues.
- **Resolved Issues**:
    1. **Infinite Scroll State**: Fixed issue where "Refresh" button didn't reset the scroll state/list.
    2. **Auth Persistence**: Updated Signup form `autocomplete` attributes to ensure browsers correctly save credentials.
    3. **Layout Overflow**: Fixed CSS overflow issues in the Account page redesign.

---

## 👨‍💻 Author

| Profile | Developer Name | Role | GitHub | LinkedIn | X |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [![Sami](https://github.com/saidulalimallick04.png?size=75)](https://github.com/saidulalimallick04) | Saidul Ali Mallick (Sami) | Backend Developer & AIML Engineer | [@saidulalimallick04](https://github.com/saidulalimallick04) | [@saidulalimallick04](https://linkedin.com/in/saidulalimallick04) | [@saidulmallick04](https://x.com/saidulmallick04) |

> ❤️ I believe in building impact, not just writing code.
> _💚 Backend Sage signing off.._
---
