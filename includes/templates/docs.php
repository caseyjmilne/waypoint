<?php
/**
 * Template for Docs Route
 * Loads the React frontend app
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<div id="waypoint-app"></div>

<?php
// Enqueue the React app
wp_enqueue_script(
    'waypoint-front',
    WAYPOINT_URL . 'apps/front/build/index.js',
    ['wp-element'],
    filemtime(WAYPOINT_PATH . 'apps/front/build/index.js'),
    true
);

// Pass data to React app
wp_localize_script('waypoint-front', 'waypointData', [
    'apiUrl' => rest_url('api/'),
    'nonce' => wp_create_nonce('wp_rest'),
]);

get_footer();
