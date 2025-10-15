<?php

namespace Waypoint\Admin;

use Waypoint\Models\DocSet;

class DocSetPage
{
    /**
     * Main render method - routes to appropriate view based on action
     */
    public static function render()
    {
        $action = isset($_GET['action']) ? sanitize_text_field($_GET['action']) : 'list';
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        switch ($action) {
            case 'new':
                self::renderNew();
                break;
            case 'edit':
                self::renderEdit($id);
                break;
            case 'list':
            default:
                self::renderList();
                break;
        }
    }

    /**
     * Handle doc set deletion
     */
    public static function handleDelete($set_id)
    {
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'delete_doc_set_' . $set_id)) {
            wp_die('Security check failed');
        }

        if (!$set_id) {
            wp_die('Invalid Doc Set ID');
        }

        $set = DocSet::find($set_id);
        if (!$set) {
            wp_die('Doc Set not found');
        }

        // Delete the doc set
        $set->delete();

        // Redirect back to list with success message
        $redirect_url = add_query_arg(
            array('page' => 'waypoint-doc-sets', 'deleted' => '1'),
            admin_url('admin.php')
        );
        wp_redirect($redirect_url);
        exit;
    }

    /**
     * Render the doc sets list
     */
    private static function renderList()
    {
        // Get all doc sets using the model
        $doc_sets = DocSet::all();

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Doc Sets</h1>
            <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets&action=new'); ?>" class="page-title-action">Add New</a>
            <hr class="wp-header-end">

            <?php if (isset($_GET['deleted']) && $_GET['deleted'] == '1'): ?>
                <div class="notice notice-success is-dismissible">
                    <p>Doc Set deleted successfully.</p>
                </div>
            <?php endif; ?>

            <?php if (empty($doc_sets)): ?>
                <p>No doc sets found. <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets&action=new'); ?>">Create your first doc set</a>.</p>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th scope="col" class="manage-column column-title column-primary" style="width: 30%;">Name</th>
                            <th scope="col" class="manage-column" style="width: 15%;">Slug</th>
                            <th scope="col" class="manage-column" style="width: 35%;">Description</th>
                            <th scope="col" class="manage-column" style="width: 10%;">Created</th>
                            <th scope="col" class="manage-column" style="width: 10%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($doc_sets as $set): ?>
                            <tr>
                                <td class="title column-title has-row-actions column-primary" data-colname="Name">
                                    <strong>
                                        <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets&action=edit&id=' . $set->id); ?>">
                                            <?php echo esc_html($set->name); ?>
                                        </a>
                                    </strong>
                                    <div class="row-actions">
                                        <span class="edit">
                                            <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets&action=edit&id=' . $set->id); ?>">Edit</a> |
                                        </span>
                                        <span class="trash">
                                            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=waypoint-doc-sets&action=delete&id=' . $set->id), 'delete_doc_set_' . $set->id); ?>"
                                               class="submitdelete"
                                               onclick="return confirm('Are you sure you want to delete this doc set?');">Delete</a>
                                        </span>
                                    </div>
                                </td>
                                <td data-colname="Slug">
                                    <?php echo esc_html($set->slug); ?>
                                </td>
                                <td data-colname="Description">
                                    <?php
                                    $desc = $set->description ?? '';
                                    echo esc_html(substr($desc, 0, 100)) . (strlen($desc) > 100 ? '...' : '');
                                    ?>
                                </td>
                                <td data-colname="Created">
                                    <?php echo esc_html(mysql2date('Y/m/d', $set->created_at)); ?>
                                </td>
                                <td data-colname="Actions">
                                    <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets&action=edit&id=' . $set->id); ?>">Edit</a> |
                                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=waypoint-doc-sets&action=delete&id=' . $set->id), 'delete_doc_set_' . $set->id); ?>"
                                       class="submitdelete"
                                       onclick="return confirm('Are you sure you want to delete this doc set?');">Delete</a>
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
            .row-actions {
                padding-top: 6px;
            }
        </style>
        <?php
    }

    /**
     * Render the new doc set form
     */
    private static function renderNew()
    {
        ?>
        <div class="wrap">
            <h1>Add New Doc Set</h1>
            <hr class="wp-header-end">
            <br>
            <?php
            // Render the Blueprint form
            if (class_exists('\ARC\Blueprint\Forms\Render')) {
                \ARC\Blueprint\Forms\Render::form('doc_set', null, [
                    'class' => 'waypoint-doc-set-form',
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
                if (e.detail.schema === 'doc_set') {
                    // Redirect to the doc sets list page
                    window.location.href = '<?php echo admin_url('admin.php?page=waypoint-doc-sets'); ?>';
                }
            });
        });
        </script>
        <?php
    }

    /**
     * Render the edit doc set form
     */
    private static function renderEdit($set_id)
    {
        if (!$set_id) {
            echo '<div class="wrap"><h1>Invalid Doc Set ID</h1></div>';
            return;
        }

        // Use the model instead of $wpdb
        $set = DocSet::find($set_id);

        if (!$set) {
            echo '<div class="wrap"><h1>Doc Set not found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit Doc Set: <?php echo esc_html($set->name); ?></h1>
            <hr class="wp-header-end">
            <br>
            <?php
            // Render the Blueprint form with record ID
            if (class_exists('\ARC\Blueprint\Forms\Render')) {
                \ARC\Blueprint\Forms\Render::form('doc_set', $set_id, [
                    'class' => 'waypoint-doc-set-form',
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
                if (e.detail.schema === 'doc_set') {
                    // Show success message
                    alert('Doc Set updated successfully!');
                }
            });
        });
        </script>
        <?php
    }
}
