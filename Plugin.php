<?php

/**
 * Plugin Name: Waypoint
 * Description: Multi-set documentation management for WordPress
 * Version: 1.0.0
 * Author: ARC Software
 */

namespace Waypoint;

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('WAYPOINT_VERSION', '1.0.0');
define('WAYPOINT_PATH', plugin_dir_path(__FILE__));
define('WAYPOINT_URL', plugin_dir_url(__FILE__));
define('WAYPOINT_FILE', __FILE__);

class Plugin
{
    private static $instance = null;

    private function __construct()
    {
        $this->registerAutoloader();
    }

    public static function init()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function registerAutoloader()
    {
        spl_autoload_register(function ($class) {
            // Only autoload classes in the Waypoint namespace
            if (strpos($class, 'Waypoint\\') !== 0) {
                return;
            }

            // Remove the Waypoint\ prefix
            $class = substr($class, strlen('Waypoint\\'));

            // Convert namespace separators to directory separators
            $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);

            // Build the file path
            $file = __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . $class . '.php';

            // Include the file if it exists
            if (file_exists($file)) {
                require_once $file;
            }
        });
    }
}

// Self-initialize
Plugin::init();