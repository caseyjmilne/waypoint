<?php

namespace Waypoint\Schemas;

use ARC\Blueprint\Schema;
use Waypoint\Collections\DocGroupCollection;

class DocGroupSchema extends Schema
{
    protected $collection = DocGroupCollection::class;

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
            ]
        ],
        'position' => [
            'type' => 'number',
            'label' => 'Position',
            'required' => false,
            'default' => 0,
        ]
    ];
}
