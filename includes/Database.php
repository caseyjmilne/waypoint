<?php

namespace Waypoint;

/**
 * Database management class for Waypoint plugin
 * Handles table creation and deletion using WordPress dbDelta
 */
class Database {

    public static function install() {

        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();
        $table_prefix = $wpdb->prefix;

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Docsets table
        $docsets_table = $table_prefix . 'docsets';
        $sql_docsets = "CREATE TABLE {$docsets_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            description text,
            icon varchar(255),
            doc_group_ids longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY slug_idx (slug)
        ) {$charset_collate};";

        // DocGroups table
        $docgroups_table = $table_prefix . 'docgroups';
        $sql_docgroups = "CREATE TABLE {$docgroups_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            docset_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            doc_ids longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY docset_id_idx (docset_id),
            KEY slug_idx (slug)
        ) {$charset_collate};";

        // Docs table
        $docs_table = $table_prefix . 'docs';
        $sql_docs = "CREATE TABLE {$docs_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            doc_group_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            content longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY doc_group_id_idx (doc_group_id),
            KEY slug_idx (slug)
        ) {$charset_collate};";

        dbDelta($sql_docsets);
        dbDelta($sql_docgroups);
        dbDelta($sql_docs);
    }

    /**
     * Uninstall database tables
     * Called on plugin deactivation/uninstall
     */
    public static function uninstall() {
        global $wpdb;

        $table_prefix = $wpdb->prefix;

        $wpdb->query("DROP TABLE IF EXISTS {$table_prefix}docs");
        $wpdb->query("DROP TABLE IF EXISTS {$table_prefix}docgroups");
        $wpdb->query("DROP TABLE IF EXISTS {$table_prefix}docsets");
    }
}
