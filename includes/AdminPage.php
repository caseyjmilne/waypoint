<?php

namespace Waypoint;

use Waypoint\Models\Doc;

class AdminPage
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
            [$this, 'renderDocGroupsListPage']
        );

        // Add submenu for doc sets
        add_submenu_page(
            'waypoint-docs',
            'Doc Sets',
            'Doc Sets',
            'edit_posts',
            'waypoint-doc-sets',
            [$this, 'renderDocSetsListPage']
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

        // Hidden submenu for creating new doc group
        add_submenu_page(
            null,
            'Add New Doc Group',
            'Add New Doc Group',
            'edit_posts',
            'waypoint-doc-groups-new',
            [$this, 'renderNewDocGroupPage']
        );

        // Hidden submenu for editing doc group
        add_submenu_page(
            null,
            'Edit Doc Group',
            'Edit Doc Group',
            'edit_posts',
            'waypoint-doc-groups-edit',
            [$this, 'renderEditDocGroupPage']
        );

        // Hidden submenu for creating new doc set
        add_submenu_page(
            null,
            'Add New Doc Set',
            'Add New Doc Set',
            'edit_posts',
            'waypoint-doc-sets-new',
            [$this, 'renderNewDocSetPage']
        );

        // Hidden submenu for editing doc set
        add_submenu_page(
            null,
            'Edit Doc Set',
            'Edit Doc Set',
            'edit_posts',
            'waypoint-doc-sets-edit',
            [$this, 'renderEditDocSetPage']
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

    /**
     * Render the doc groups list page
     */
    public function renderDocGroupsListPage()
    {
        global $wpdb;

        // Get all doc groups
        $table_name = $wpdb->prefix . 'doc_groups';
        $doc_groups = $wpdb->get_results("SELECT * FROM $table_name ORDER BY position ASC, created_at DESC");

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Doc Groups</h1>
            <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups-new'); ?>" class="page-title-action">Add New</a>
            <hr class="wp-header-end">

            <?php if (empty($doc_groups)): ?>
                <p>No doc groups found. <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups-new'); ?>">Create your first doc group</a>.</p>
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
                            <?php
                            $doc_set = null;
                            if ($group->doc_set_id) {
                                $set_table = $wpdb->prefix . 'doc_sets';
                                $doc_set = $wpdb->get_row($wpdb->prepare(
                                    "SELECT * FROM $set_table WHERE id = %d",
                                    $group->doc_set_id
                                ));
                            }
                            ?>
                            <tr>
                                <td class="title column-title has-row-actions column-primary" data-colname="Title">
                                    <strong>
                                        <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups-edit&id=' . $group->id); ?>">
                                            <?php echo esc_html($group->title); ?>
                                        </a>
                                    </strong>
                                </td>
                                <td data-colname="Slug">
                                    <?php echo esc_html($group->slug); ?>
                                </td>
                                <td data-colname="Doc Set">
                                    <?php echo $doc_set ? esc_html($doc_set->name) : '—'; ?>
                                </td>
                                <td data-colname="Position">
                                    <?php echo esc_html($group->position); ?>
                                </td>
                                <td data-colname="Created">
                                    <?php echo esc_html(mysql2date('Y/m/d', $group->created_at)); ?>
                                </td>
                                <td data-colname="Actions">
                                    <a href="<?php echo admin_url('admin.php?page=waypoint-doc-groups-edit&id=' . $group->id); ?>">Edit</a>
                                    |
                                    <a href="#" onclick="return confirm('Are you sure you want to delete this doc group?');" class="delete-group" data-id="<?php echo $group->id; ?>">Delete</a>
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
     * Render the new doc group page
     */
    public function renderNewDocGroupPage()
    {
        ?>
        <div class="wrap">
            <h1>Add New Doc Group</h1>
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
     * Render the edit doc group page
     */
    public function renderEditDocGroupPage()
    {
        $group_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (!$group_id) {
            echo '<div class="wrap"><h1>Invalid Doc Group ID</h1></div>';
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'doc_groups';
        $group = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $group_id));

        if (!$group) {
            echo '<div class="wrap"><h1>Doc Group not found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit Doc Group: <?php echo esc_html($group->title); ?></h1>
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
                    // Show success message or redirect
                    alert('Doc Group updated successfully!');
                }
            });
        });
        </script>
        <?php
    }

    /**
     * Render the doc sets list page
     */
    public function renderDocSetsListPage()
    {
        global $wpdb;

        // Get all doc sets
        $table_name = $wpdb->prefix . 'doc_sets';
        $doc_sets = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Doc Sets</h1>
            <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets-new'); ?>" class="page-title-action">Add New</a>
            <hr class="wp-header-end">

            <?php if (empty($doc_sets)): ?>
                <p>No doc sets found. <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets-new'); ?>">Create your first doc set</a>.</p>
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
                                        <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets-edit&id=' . $set->id); ?>">
                                            <?php echo esc_html($set->name); ?>
                                        </a>
                                    </strong>
                                </td>
                                <td data-colname="Slug">
                                    <?php echo esc_html($set->slug); ?>
                                </td>
                                <td data-colname="Description">
                                    <?php echo esc_html(substr($set->description, 0, 100)) . (strlen($set->description) > 100 ? '...' : ''); ?>
                                </td>
                                <td data-colname="Created">
                                    <?php echo esc_html(mysql2date('Y/m/d', $set->created_at)); ?>
                                </td>
                                <td data-colname="Actions">
                                    <a href="<?php echo admin_url('admin.php?page=waypoint-doc-sets-edit&id=' . $set->id); ?>">Edit</a>
                                    |
                                    <a href="#" onclick="return confirm('Are you sure you want to delete this doc set?');" class="delete-set" data-id="<?php echo $set->id; ?>">Delete</a>
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
     * Render the new doc set page
     */
    public function renderNewDocSetPage()
    {
        ?>
        <div class="wrap">
            <h1>Add New Doc Set</h1>
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
     * Render the edit doc set page
     */
    public function renderEditDocSetPage()
    {
        $set_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (!$set_id) {
            echo '<div class="wrap"><h1>Invalid Doc Set ID</h1></div>';
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'doc_sets';
        $set = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $set_id));

        if (!$set) {
            echo '<div class="wrap"><h1>Doc Set not found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit Doc Set: <?php echo esc_html($set->name); ?></h1>
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
                    // Show success message or redirect
                    alert('Doc Set updated successfully!');
                }
            });
        });
        </script>
        <?php
    }
}
