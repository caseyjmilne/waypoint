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
        'prefix' => 'docgroups',
        'methods' => [
            'get_many' => true,      // GET /api/docgroups
            'get_one' => true,       // GET /api/docgroups/{id}
            'create' => true,        // POST /api/docgroups
            'update' => true,        // PUT/PATCH /api/docgroups/{id}
            'delete' => true,        // DELETE /api/docgroups/{id}
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
        'filterable' => ['name', 'docset_id'],
        'sortable' => ['name', 'created_at', 'updated_at'],
        'relations' => ['docSet'],
        'hidden' => [],
        'appends' => [],
        'per_page' => 15,
        'max_per_page' => 100,
    ];
}
