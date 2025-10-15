<?php

namespace Waypoint\Admin;

use Waypoint\Models\Doc;

class DocPage
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
     * Handle doc deletion
     */
    public static function handleDelete($doc_id)
    {
        // Verify nonce
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'delete_doc_' . $doc_id)) {
            wp_die('Security check failed');
        }

        if (!$doc_id) {
            wp_die('Invalid Doc ID');
        }

        $doc = Doc::find($doc_id);
        if (!$doc) {
            wp_die('Doc not found');
        }

        // Delete the doc
        $doc->delete();

        // Redirect back to list with success message
        $redirect_url = add_query_arg(
            array('page' => 'waypoint-docs', 'deleted' => '1'),
            admin_url('admin.php')
        );
        wp_redirect($redirect_url);
        exit;
    }

    /**
     * Render the docs list
     */
    private static function renderList()
    {
        // Get all docs using the model, ordered by created_at
        $docs = Doc::orderBy('created_at', 'desc')->get();

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Docs</h1>
            <a href="<?php echo admin_url('admin.php?page=waypoint-docs&action=new'); ?>" class="page-title-action">Add New</a>
            <hr class="wp-header-end">

            <?php if (isset($_GET['deleted']) && $_GET['deleted'] == '1'): ?>
                <div class="notice notice-success is-dismissible">
                    <p>Doc deleted successfully.</p>
                </div>
            <?php endif; ?>

            <?php if (empty($docs) || $docs->isEmpty()): ?>
                <p>No docs found. <a href="<?php echo admin_url('admin.php?page=waypoint-docs&action=new'); ?>">Create your first doc</a>.</p>
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
                            <tr>
                                <td class="title column-title has-row-actions column-primary" data-colname="Title">
                                    <strong>
                                        <a href="<?php echo admin_url('admin.php?page=waypoint-docs&action=edit&id=' . $doc->id); ?>">
                                            <?php echo esc_html($doc->title); ?>
                                        </a>
                                    </strong>
                                    <div class="row-actions">
                                        <span class="edit">
                                            <a href="<?php echo admin_url('admin.php?page=waypoint-docs&action=edit&id=' . $doc->id); ?>">Edit</a> |
                                        </span>
                                        <span class="trash">
                                            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=waypoint-docs&action=delete&id=' . $doc->id), 'delete_doc_' . $doc->id); ?>"
                                               class="submitdelete"
                                               onclick="return confirm('Are you sure you want to delete this doc?');">Delete</a>
                                        </span>
                                    </div>
                                </td>
                                <td data-colname="Slug">
                                    <?php echo esc_html($doc->slug); ?>
                                </td>
                                <td data-colname="Doc Group">
                                    <?php
                                    // Use the relationship to get the doc group
                                    $doc_group = $doc->docGroup;
                                    echo $doc_group ? esc_html($doc_group->title) : '—';
                                    ?>
                                </td>
                                <td data-colname="Created">
                                    <?php echo esc_html(mysql2date('Y/m/d', $doc->created_at)); ?>
                                </td>
                                <td data-colname="Actions">
                                    <a href="<?php echo admin_url('admin.php?page=waypoint-docs&action=edit&id=' . $doc->id); ?>">Edit</a> |
                                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=waypoint-docs&action=delete&id=' . $doc->id), 'delete_doc_' . $doc->id); ?>"
                                       class="submitdelete"
                                       onclick="return confirm('Are you sure you want to delete this doc?');">Delete</a>
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
     * Render the new doc form
     */
    private static function renderNew()
    {
        ?>
        <div class="wrap">
            <h1>Add New Doc</h1>
            <hr class="wp-header-end">
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
     * Render the edit doc form
     */
    private static function renderEdit($doc_id)
    {
        if (!$doc_id) {
            echo '<div class="wrap"><h1>Invalid Doc ID</h1></div>';
            return;
        }

        // Use the model instead of $wpdb
        $doc = Doc::find($doc_id);

        if (!$doc) {
            echo '<div class="wrap"><h1>Doc not found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit Doc: <?php echo esc_html($doc->title); ?></h1>
            <hr class="wp-header-end">
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
                    // Show success message
                    alert('Doc updated successfully!');
                }
            });
        });
        </script>
        <?php
    }
}
