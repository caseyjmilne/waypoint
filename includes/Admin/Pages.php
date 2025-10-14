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
