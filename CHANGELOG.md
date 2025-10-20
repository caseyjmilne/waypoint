# Changelog

All notable changes to Waypoint will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-20

### Changed
- Rebuilt for Gateway plugin with singular collections
- Migrated to Gateway Collection system for DocSet, DocGroup, and Doc models
- Updated Collections to use Gateway's collection architecture
- Streamlined codebase by removing legacy components

### Removed
- Legacy admin pages (DocSetPage, DocGroupPage, DocPage, Pages, AdminPage)
- Legacy models (DocSet, DocGroup, Doc)
- Legacy schemas (DocSetSchema, DocGroupSchema, DocSchema)

### Improved
- Performance through simplified architecture
- Code maintainability with unified collection system
- Frontend build updated with latest dependencies

### Requirements
- Now requires Gateway plugin to be installed and active

## [1.0.1] - 2024-XX-XX

### Improved
- Documentation layout and styling
- Sidebar navigation experience
- Table of contents positioning

### Fixed
- API routing issues
- Frontend display bugs

## [1.0.0] - 2024-XX-XX

### Added
- Initial release
- Multi-set documentation support
- Documentation groups and hierarchical organization
- Custom admin interface for managing docs
- Frontend template system with /docs endpoint
- Database-driven content management
- React-based frontend with markdown rendering
- Syntax highlighting for code blocks
- Responsive documentation viewer
