<?php
/**
 * Template for Docs Route
 * Loads the React frontend app
 */

if (!defined('ABSPATH')) {
    exit;
}

// Enqueue the CSS before header
wp_enqueue_style(
    'waypoint-front-css',
    WAYPOINT_URL . 'apps/front/build/index.css',
    [],
    filemtime(WAYPOINT_PATH . 'apps/front/build/index.css')
);

// Enqueue the React app before header
wp_enqueue_script(
    'waypoint-front',
    WAYPOINT_URL . 'apps/front/build/index.js',
    ['wp-element'],
    filemtime(WAYPOINT_PATH . 'apps/front/build/index.js'),
    true
);

// Pass data to React app
wp_localize_script('waypoint-front', 'waypointData', [
    'apiUrl' => rest_url('gateway/v1'),
    'nonce' => wp_create_nonce('wp_rest'),
    'isLoggedIn' => is_user_logged_in(),
    'canManageDocs' => current_user_can('manage_options'),
    'adminUrl' => admin_url('admin.php?page=gateway-collections'),
]);

get_header();
?>

<div id="waypoint-app"></div>

<?php
get_footer();
