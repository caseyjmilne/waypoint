<?php

namespace Waypoint\Admin;

class Pages
{
    /**
     * Initialize the admin page
     */
    public function __construct()
    {
        add_action('admin_menu', [$this, 'addMenuPage']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
        add_action('admin_init', [$this, 'handleDeleteActions']);
    }

    /**
     * Handle delete actions before any output is sent
     */
    public function handleDeleteActions()
    {
        // Check if we're on a waypoint admin page with a delete action
        if (!isset($_GET['page']) || !isset($_GET['action']) || $_GET['action'] !== 'delete') {
            return;
        }

        $page = sanitize_text_field($_GET['page']);
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        // Route to appropriate delete handler
        switch ($page) {
            case 'waypoint-docs':
                DocPage::handleDelete($id);
                break;
            case 'waypoint-doc-groups':
                DocGroupPage::handleDelete($id);
                break;
            case 'waypoint-doc-sets':
                DocSetPage::handleDelete($id);
                break;
        }
    }

    /**
     * Enqueue admin assets
     */
    public function enqueueAssets($hook)
    {
        // Only load on our admin pages
        if (strpos($hook, 'waypoint') === false) {
            return;
        }

        // Enqueue WordPress default styles for better admin UI
        wp_enqueue_style('wp-admin');
    }

    /**
     * Add menu page to WordPress admin
     */
    public function addMenuPage()
    {
        add_menu_page(
            'Waypoint Docs',           // Page title
            'Waypoint',                // Menu title
            'edit_posts',              // Capability
            'waypoint-docs',           // Menu slug
            ['Waypoint\Admin\DocPage', 'render'], // Callback function
            'dashicons-book-alt',      // Icon
            25                         // Position
        );

        // Add submenu for docs list
        add_submenu_page(
            'waypoint-docs',
            'All Docs',
            'All Docs',
            'edit_posts',
            'waypoint-docs',
            ['Waypoint\Admin\DocPage', 'render']
        );

        // Add submenu for doc groups
        add_submenu_page(
            'waypoint-docs',
            'Doc Groups',
            'Doc Groups',
            'edit_posts',
            'waypoint-doc-groups',
            ['Waypoint\Admin\DocGroupPage', 'render']
        );

        // Add submenu for doc sets
        add_submenu_page(
            'waypoint-docs',
            'Doc Sets',
            'Doc Sets',
            'edit_posts',
            'waypoint-doc-sets',
            ['Waypoint\Admin\DocSetPage', 'render']
        );

    }

}
