# Project Activity 3: Automated Software Testing and Deployment

## 1. Backlog Features Implemented
For this activity, the team focused on features that deepen user engagement and motivation, satisfying the "marketing department" request for advanced capabilities.

*   **Daily Writing Goals**: A persistence-based system where users can set a daily target (e.g., 500 words).
*   **Progress Visualization**: Real-time progress tracking on the dashboard with a dynamic progress bar.
*   **Advanced Theme Engine**: Enhanced customization options for user personalization.

### Specific Objectives
*   **Gamification**: Provide a sense of accomplishment by tracking daily targets.
*   **Retention**: Encourage daily returns via word count visualization and goal-setting.
*   **Personalization**: Allow the journal to feel like a custom-tailored editorial space.

### Rationale
These features were chosen because they directly address user feedback regarding "consistency" and "editorial feel," moving the app from a simple notepad to a robust writing practice tool.

## 2. Team Member Roles & Strategy
*   **DevOps Engineer**: Responsible for the design and implementation of the GitHub Actions pipeline.
*   **Full-Stack Developer**: Implemented the Daily Goals state logic and dashboard integration.
*   **QA Engineer**: Wrote unit and component tests to ensure regression-free deployments.
*   **Product Manager**: Defined the backlog prioritization based on marketing feedback.

### Team Strategy
Our strategy shifted toward a **Continuous Integration (CI)** model. Previously, we manually reviewed code, which led to regression bugs. By implementing automated gates, we ensure that:
1. Code must be linted according to project standards.
2. Logic must pass unit tests (e.g., word count, streak calculations).
3. The build must succeed before any merge to `main`.

## 3. Automated Testing Process
Our automated pipeline is triggered on every `push` and `pull_request` to the `main` branch.

### Test Cases Used
*   **Unit Tests**:
    *   `countWords`: Verified accurate word counts with various inputs.
    *   `calculateStreak`: Tested logic for identifying consecutive writing days.
    *   `statsFromEntries`: Ensured archival summaries are calculated correctly.
*   **Component Tests**:
    *   `Button`: Verified rendering and dynamic class application.
    *   `Dashboard`: Verified that progress bars react to the daily goal state.

## 4. CI/CD Pipeline Functionality
Implemented using **GitHub Actions**, the pipeline handles:
1. **Environment Setup**: Provisions a Node.js environment (v20.x).
2. **Dependency Management**: Uses `npm ci` for fast, reproducible installs.
3. **Linting**: Runs ESLint to maintain code quality.
4. **Automated Testing**: Executes the Vitest suite.
5. **Build Verification**: Ensures the Vite production build completes without errors.

## 5. Reflection & Technical Problems
### Issues Encountered
*   **ReferenceErrors**: Initially, some components were missing imports (like `Button`), causing crashes that were only found at runtime. The CI pipeline now catches these during the Build step.
*   **Environment Variables**: Handling Supabase keys in a CI environment required configuring GitHub Secrets.
*   **Testing Logic**: Calculating streaks required complex date manipulation, which was prone to errors. Unit tests now validate this logic against multiple edge cases (e.g., leap years, time zone shifts).

### Solutions Found
*   Implemented a **Global Error Boundary** to prevent total app crashes.
*   Automated the build process to catch "missing import" errors before they reach production.
*   Used **Vitest** for its speed and integration with the Vite build tool.
