<?php

namespace Waypoint\Collections;

class DocGroupCollection extends \Gateway\Collection
{
    protected $key = 'doc_groups';
    protected $table = 'doc_groups';
    protected $fillable = ['doc_set_id', 'title', 'slug', 'position'];

    /**
     * @var array API route configuration
     */
    protected $routes = [
        'enabled' => true,
        'namespace' => 'gateway',
        'version' => 'v1',
        'route' => 'doc-groups',
        'allow_basic_auth' => true,
        'methods' => [
            'get_many' => true,
            'get_one' => true,
            'create' => true,
            'update' => true,
            'delete' => true,
        ],
        'permissions' => [
            'get_many' => 'read',
            'get_one' => 'read',
            'create' => 'edit_posts',
            'update' => 'edit_posts',
            'delete' => 'delete_posts',
        ],
    ];

    /**
     * @var array Field definitions
     */
    protected $fields = [
        'title' => [
            'type' => 'text',
            'label' => 'Doc Group Title',
            'required' => true,
            'placeholder' => 'Doc group title...',
        ],
        'doc_set_id' => [
            'type' => 'relation',
            'label' => 'Doc Set',
            'required' => true,
            'relation' => [
                'endpoint' => '/wp-json/gateway/v1/doc-sets',
                'labelField' => 'name',
                'valueField' => 'id',
                'placeholder' => 'Select a doc set...',
            ],
        ],
        'position' => [
            'type' => 'number',
            'label' => 'Position',
            'required' => false,
            'default' => 0,
        ],
    ];

    /**
     * @var array Filter definitions
     */
    protected $filters = [
        [
            'type' => 'text',
            'field' => 'search',
            'label' => 'Search',
            'placeholder' => 'Search doc groups...',
        ],
        [
            'type' => 'select',
            'field' => 'doc_set_id',
            'label' => 'Doc Set',
            'placeholder' => 'All Doc Sets',
            'options_endpoint' => '/wp-json/gateway/v1/doc-sets',
        ],
        [
            'type' => 'date_range',
            'field' => 'created_at',
            'label' => 'Created Date',
            'placeholder' => [
                'start' => 'Start Date',
                'end' => 'End Date',
            ],
        ],
    ];
}
