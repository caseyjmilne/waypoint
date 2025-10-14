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

        // Doc Sets table
        $doc_sets_table = $table_prefix . 'doc_sets';
        $sql_doc_sets = "CREATE TABLE {$doc_sets_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            description text,
            icon varchar(255),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY slug_idx (slug)
        ) {$charset_collate};";

        // Doc Groups table
        $doc_groups_table = $table_prefix . 'doc_groups';
        $sql_doc_groups = "CREATE TABLE {$doc_groups_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            doc_set_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            position int(11) NOT NULL DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY doc_set_id_idx (doc_set_id),
            KEY slug_idx (slug),
            KEY position_idx (position)
        ) {$charset_collate};";

        // Docs table
        $docs_table = $table_prefix . 'docs';
        $sql_docs = "CREATE TABLE {$docs_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            doc_group_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            content longtext,
            position int(11) NOT NULL DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY doc_group_id_idx (doc_group_id),
            KEY slug_idx (slug),
            KEY position_idx (position)
        ) {$charset_collate};";

        dbDelta($sql_doc_sets);
        dbDelta($sql_doc_groups);
        dbDelta($sql_docs);
    }
}
