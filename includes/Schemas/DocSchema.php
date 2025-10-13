<?php

namespace Waypoint\Schemas;

use ARC\Blueprint\Schema;
use Waypoint\Collections\DocCollection;

class DocSchema extends Schema
{
    protected $collection = DocCollection::class;

    protected $fields = [
        'title' => [
            'type' => 'text',
            'label' => 'Doc Title',
            'required' => true,
            'placeholder' => 'Doc title...',
        ],
        'content' => [
            'type' => 'markdown'
        ],
        'doc_group_id' => [
          'type' => 'relation',
          'label' => 'Doc Group',
          'required' => true,
          'relation' => [
              'endpoint' => '/wp-json/gateway/v1/doc_groups',
              'labelField' => 'title',
              'valueField' => 'id',
              'placeholder' => 'Select a doc group...',
          ]
      ]

    ];
}