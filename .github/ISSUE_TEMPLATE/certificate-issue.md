## Certificate Issue

As a developer of Material Donor Mutual Assist
I want to integrate Rerum’s integration into Material Donor Mutual Assist
So that I can generate certificates for donor contributions


## Acceptance Criteria

- [ ] When I push code to the main branch, the GitHub Actions workflow triggers automatically.
- [ ] When I create a pull request, the workflow runs linting, tests, and certificate validation.
- [ ] The pipeline checks code formatting with Prettier and reports any issues.
- [ ] Unit tests execute successfully via Jest, verifying core functionality.
- [ ] A test certificate PDF is generated and validated during the workflow.
- [ ] Dependency caching speeds up builds, with no errors from missing packages.
- [ ] The workflow completes without errors, and results are visible in GitHub Actions.


## Requirements

- [ ] The change is targeted. Adds automated testing and certificate generation validation to the pipeline, focusing on key areas.
- [ ] The change is justified. Reduces manual errors, ensures code quality, and verifies the donor certificate feature before deployment.
- [ ] The change is valuable. Boosts donor trust by ensuring reliable certificate functionality and saves team time via automation.
- [ ] The change improves the ability of the team to make changes to the code safely. Integrates linting, tests, and checks to catch issues early.
- [ ] The change is clear and understandable. Uses descriptive step names and standard YAML for easy comprehension.
- [ ] The change works as intended. Workflow runs on push/pull requests, tests code, and validates certificate generation.
- [ ] The change follows established coding standards established for the project. Adheres to Prettier formatting and project conventions.
- [ ] The change uses good naming practices and established style conventions. Steps like "Check Code Formatting" and variables like ${{ runner.os }}-node- are clear and consistent.
- [ ] The change has a well formed GitHub Issue that uses the standard templates and practices established for this class. Issue created with class template, detailing purpose and criteria.
- [ ] The change is in a Pull Request that contains a clear and concise explanation of the work and the justification for it. PR includes workflow details, justification, and issue link.

