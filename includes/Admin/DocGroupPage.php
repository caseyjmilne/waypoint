<?php

namespace Waypoint\Admin;

use Waypoint\Models\DocGroup;

class DocGroupPage
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
     * Render the doc groups list
     */
    private static function renderList()
    {
        // Get all doc groups using the model, ordered by position and created_at
        $doc_groups = DocGroup::orderBy('position', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Doc Groups</h1>
            <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups&action=new'); ?>" class="page-title-action">Add New</a>
            <hr class="wp-header-end">

            <?php if (empty($doc_groups) || $doc_groups->isEmpty()): ?>
                <p>No doc groups found. <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups&action=new'); ?>">Create your first doc group</a>.</p>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th scope="col" class="manage-column column-title column-primary" style="width: 30%;">Title</th>
                            <th scope="col" class="manage-column" style="width: 15%;">Slug</th>
                            <th scope="col" class="manage-column" style="width: 20%;">Doc Set</th>
                            <th scope="col" class="manage-column" style="width: 10%;">Position</th>
                            <th scope="col" class="manage-column" style="width: 15%;">Created</th>
                            <th scope="col" class="manage-column" style="width: 10%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($doc_groups as $group): ?>
                            <tr>
                                <td class="title column-title has-row-actions column-primary" data-colname="Title">
                                    <strong>
                                        <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups&action=edit&id=' . $group->id); ?>">
                                            <?php echo esc_html($group->title); ?>
                                        </a>
                                    </strong>
                                    <div class="row-actions">
                                        <span class="edit">
                                            <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups&action=edit&id=' . $group->id); ?>">Edit</a>
                                        </span>
                                    </div>
                                </td>
                                <td data-colname="Slug">
                                    <?php echo esc_html($group->slug); ?>
                                </td>
                                <td data-colname="Doc Set">
                                    <?php
                                    // Use the relationship to get the doc set
                                    $doc_set = $group->docSet;
                                    echo $doc_set ? esc_html($doc_set->name) : '—';
                                    ?>
                                </td>
                                <td data-colname="Position">
                                    <?php echo esc_html($group->position ?? 0); ?>
                                </td>
                                <td data-colname="Created">
                                    <?php echo esc_html(mysql2date('Y/m/d', $group->created_at)); ?>
                                </td>
                                <td data-colname="Actions">
                                    <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups&action=edit&id=' . $group->id); ?>">Edit</a>
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
     * Render the new doc group form
     */
    private static function renderNew()
    {
        ?>
        <div class="wrap">
            <h1>Add New Doc Group</h1>
            <hr class="wp-header-end">
            <br>
            <?php
            // Render the Blueprint form
            if (class_exists('\ARC\Blueprint\Forms\Render')) {
                \ARC\Blueprint\Forms\Render::form('doc_group', null, [
                    'class' => 'waypoint-doc-group-form',
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
                if (e.detail.schema === 'doc_group') {
                    // Redirect to the doc groups list page
                    window.location.href = '<?php echo admin_url('admin.php?page=waypoint-doc-groups'); ?>';
                }
            });
        });
        </script>
        <?php
    }

    /**
     * Render the edit doc group form
     */
    private static function renderEdit($group_id)
    {
        if (!$group_id) {
            echo '<div class="wrap"><h1>Invalid Doc Group ID</h1></div>';
            return;
        }

        // Use the model instead of $wpdb
        $group = DocGroup::find($group_id);

        if (!$group) {
            echo '<div class="wrap"><h1>Doc Group not found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit Doc Group: <?php echo esc_html($group->title); ?></h1>
            <hr class="wp-header-end">
            <br>
            <?php
            // Render the Blueprint form with record ID
            if (class_exists('\ARC\Blueprint\Forms\Render')) {
                \ARC\Blueprint\Forms\Render::form('doc_group', $group_id, [
                    'class' => 'waypoint-doc-group-form',
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
                if (e.detail.schema === 'doc_group') {
                    // Show success message
                    alert('Doc Group updated successfully!');
                }
            });
        });
        </script>
        <?php
    }
}
