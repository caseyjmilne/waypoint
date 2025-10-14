<?php

namespace Waypoint\Admin;

use Waypoint\Models\Doc;

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
            [$this, 'renderDocsListPage'], // Callback function
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
            [$this, 'renderDocsListPage']
        );

        // Add submenu for creating new doc
        add_submenu_page(
            'waypoint-docs',
            'Add New Doc',
            'Add New',
            'edit_posts',
            'waypoint-docs-new',
            [$this, 'renderNewDocPage']
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

        // Hidden submenu for editing doc
        add_submenu_page(
            null, // Hidden from menu
            'Edit Doc',
            'Edit Doc',
            'edit_posts',
            'waypoint-docs-edit',
            [$this, 'renderEditDocPage']
        );

    }

    /**
     * Render the docs list page
     */
    public function renderDocsListPage()
    {
        global $wpdb;

        // Get all docs
        $table_name = $wpdb->prefix . 'docs';
        $docs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Docs</h1>
            <a href="<?php echo admin_url('admin.php?page=waypoint-docs-new'); ?>" class="page-title-action">Add New</a>
            <hr class="wp-header-end">

            <?php if (empty($docs)): ?>
                <p>No docs found. <a href="<?php echo admin_url('admin.php?page=waypoint-docs-new'); ?>">Create your first doc</a>.</p>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th scope="col" class="manage-column column-title column-primary" style="width: 40%;">Title</th>
                            <th scope="col" class="manage-column" style="width: 15%;">Slug</th>
                            <th scope="col" class="manage-column" style="width: 20%;">Doc Group</th>
                            <th scope="col" class="manage-column" style="width: 15%;">Created</th>
                            <th scope="col" class="manage-column" style="width: 10%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($docs as $doc): ?>
                            <?php
                            $doc_group = null;
                            if ($doc->doc_group_id) {
                                $group_table = $wpdb->prefix . 'doc_groups';
                                $doc_group = $wpdb->get_row($wpdb->prepare(
                                    "SELECT * FROM $group_table WHERE id = %d",
                                    $doc->doc_group_id
                                ));
                            }
                            ?>
                            <tr>
                                <td class="title column-title has-row-actions column-primary" data-colname="Title">
                                    <strong>
                                        <a href="<?php echo admin_url('admin.php?page=waypoint-docs-edit&id=' . $doc->id); ?>">
                                            <?php echo esc_html($doc->title); ?>
                                        </a>
                                    </strong>
                                </td>
                                <td data-colname="Slug">
                                    <?php echo esc_html($doc->slug); ?>
                                </td>
                                <td data-colname="Doc Group">
                                    <?php echo $doc_group ? esc_html($doc_group->title) : '—'; ?>
                                </td>
                                <td data-colname="Created">
                                    <?php echo esc_html(mysql2date('Y/m/d', $doc->created_at)); ?>
                                </td>
                                <td data-colname="Actions">
                                    <a href="<?php echo admin_url('admin.php?page=waypoint-docs-edit&id=' . $doc->id); ?>">Edit</a>
                                    |
                                    <a href="#" onclick="return confirm('Are you sure you want to delete this doc?');" class="delete-doc" data-id="<?php echo $doc->id; ?>">Delete</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>

        <style>
            .wp-list-table td, .wp-list-table th {
                padding: 12px 10px;
            }
            .wp-list-table .column-primary {
                font-weight: 600;
            }
        </style>
        <?php
    }

    /**
     * Render the new doc page
     */
    public function renderNewDocPage()
    {
        ?>
        <div class="wrap">
            <h1>Add New Doc</h1>
            <br>
            <?php
            // Render the Blueprint form
            if (class_exists('\ARC\Blueprint\Forms\Render')) {
                \ARC\Blueprint\Forms\Render::form('doc', null, [
                    'class' => 'waypoint-doc-form',
                    'style' => 'max-width: 800px;'
                ]);
            } else {
                echo '<p>ARC Blueprint plugin is required to render forms.</p>';
            }
            ?>
        </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Listen for form submission success
            document.addEventListener('blueprint-form-success', function(e) {
                if (e.detail.schema === 'doc') {
                    // Redirect to the docs list page
                    window.location.href = '<?php echo admin_url('admin.php?page=waypoint-docs'); ?>';
                }
            });
        });
        </script>
        <?php
    }

    /**
     * Render the edit doc page
     */
    public function renderEditDocPage()
    {
        $doc_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (!$doc_id) {
            echo '<div class="wrap"><h1>Invalid Doc ID</h1></div>';
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'docs';
        $doc = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $doc_id));

        if (!$doc) {
            echo '<div class="wrap"><h1>Doc not found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit Doc: <?php echo esc_html($doc->title); ?></h1>
            <br>
            <?php
            // Render the Blueprint form with record ID
            if (class_exists('\ARC\Blueprint\Forms\Render')) {
                \ARC\Blueprint\Forms\Render::form('doc', $doc_id, [
                    'class' => 'waypoint-doc-form',
                    'style' => 'max-width: 800px;'
                ]);
            } else {
                echo '<p>ARC Blueprint plugin is required to render forms.</p>';
            }
            ?>
        </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Listen for form submission success
            document.addEventListener('blueprint-form-success', function(e) {
                if (e.detail.schema === 'doc') {
                    // Show success message or redirect
                    alert('Doc updated successfully!');
                }
            });
        });
        </script>
        <?php
    }

}
