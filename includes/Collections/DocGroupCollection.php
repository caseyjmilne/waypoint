<?php

namespace Waypoint\Collections;

use Waypoint\Models\DocGroup;

class DocGroupCollection extends \ARC\Gateway\Collection
{
    /**
     * @var string The Eloquent model this collection manages
     */
    protected $model = DocGroup::class;

    /**
     * @var array API route configuration
     */
    protected $routes = [
        'enabled' => true,
        'prefix' => 'doc-groups',
        'methods' => [
            'get_many' => true,      // GET /api/doc-groups
            'get_one' => true,       // GET /api/doc-groups/{id}
            'create' => true,        // POST /api/doc-groups
            'update' => true,        // PUT/PATCH /api/doc-groups/{id}
            'delete' => true,        // DELETE /api/doc-groups/{id}
        ],
        'middleware' => [],
        'permissions' => [
            'get_many' => 'read',
            'get_one' => 'read',
            'create' => 'edit_posts',
            'update' => 'edit_posts',
            'delete' => 'delete_posts',
        ],
    ];

    /**
     * @var array Model analysis configuration
     */
    protected $config = [
        'searchable' => ['title', 'slug'],
        'filterable' => ['title', 'doc_set_id'],
        'sortable' => ['title', 'created_at', 'updated_at'],
        'relations' => ['docSet'],
        'hidden' => [],
        'appends' => [],
        'per_page' => 15,
        'max_per_page' => 100,
    ];
}
