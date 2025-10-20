<?php

namespace Waypoint\Collections;

class DocSetCollection extends \Gateway\Collection
{
    protected $key = 'doc_sets';
    protected $table = 'doc_sets';
    protected $fillable = ['name', 'description', 'slug', 'icon'];

    /**
     * @var array API route configuration
     */
    protected $routes = [
        'enabled' => true,
        'namespace' => 'gateway',
        'version' => 'v1',
        // Route auto-generated from $key: 'doc_sets' -> 'doc-sets'
        'allow_basic_auth' => true,
        'methods' => [
            'get_many' => true,
            'get_one' => true,
            'create' => true,
            'update' => true,
            'delete' => true,
        ],
        'permissions' => [
            'get_many' => [
                'type' => 'nonce_only',
                'settings' => []
            ],
            'get_one' => [
                'type' => 'nonce_only',
                'settings' => []
            ],
            'create' => [
                'type' => 'cookie_authentication',
                'settings' => [
                    'capability' => 'edit_posts'
                ]
            ],
            'update' => [
                'type' => 'cookie_authentication',
                'settings' => [
                    'capability' => 'edit_posts'
                ]
            ],
            'delete' => [
                'type' => 'cookie_authentication',
                'settings' => [
                    'capability' => 'delete_posts'
                ]
            ],
        ],
    ];

    /**
     * @var array Field definitions
     */
    protected $fields = [
        'name' => [
            'type' => 'text',
            'label' => 'Doc Set Name',
            'required' => true,
            'placeholder' => 'Doc set name...',
        ],
        'description' => [
            'type' => 'textarea',
            'label' => 'Description',
            'required' => false,
            'placeholder' => 'Doc set description...',
        ],
        'icon' => [
            'type' => 'text',
            'label' => 'Icon',
            'required' => false,
            'placeholder' => 'Icon name or URL...',
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
            'placeholder' => 'Search doc sets...',
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
