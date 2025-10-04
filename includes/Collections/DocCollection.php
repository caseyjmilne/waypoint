<?php

namespace Waypoint\Collections;

use Waypoint\Models\Doc;

class DocCollection extends \ARC\Gateway\Collection
{
    /**
     * @var string The Eloquent model this collection manages
     */
    protected $model = Doc::class;

    /**
     * @var array API route configuration
     */
    protected $routes = [
        'enabled' => true,
        'prefix' => 'docs',
        'methods' => [
            'get_many' => true,      // GET /api/docs
            'get_one' => true,       // GET /api/docs/{id}
            'create' => true,        // POST /api/docs
            'update' => true,        // PUT/PATCH /api/docs/{id}
            'delete' => true,        // DELETE /api/docs/{id}
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
        'searchable' => ['title', 'content', 'slug'],
        'filterable' => ['slug', 'docgroup_id'],
        'sortable' => ['title', 'created_at', 'updated_at'],
        'relations' => ['docGroup'],
        'hidden' => [],
        'appends' => [],
        'per_page' => 15,
        'max_per_page' => 100,
    ];
}
