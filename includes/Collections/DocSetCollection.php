<?php

namespace Waypoint\Collections;

use Waypoint\Models\DocSet;

class DocSetCollection extends \ARC\Gateway\Collection
{
    /**
     * @var string The Eloquent model this collection manages
     */
    protected $model = DocSet::class;

    /**
     * @var array API route configuration
     */
    protected $routes = [
        'enabled' => true,
        'prefix' => 'docsets',
        'methods' => [
            'get_many' => true,      // GET /api/docsets
            'get_one' => true,       // GET /api/docsets/{id}
            'create' => true,        // POST /api/docsets
            'update' => true,        // PUT/PATCH /api/docsets/{id}
            'delete' => true,        // DELETE /api/docsets/{id}
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
        'searchable' => ['name', 'description'],
        'filterable' => ['name'],
        'sortable' => ['name', 'created_at', 'updated_at'],
        'relations' => [],
        'hidden' => [],
        'appends' => [],
        'per_page' => 15,
        'max_per_page' => 100,
    ];
}
