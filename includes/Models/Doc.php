<?php

namespace Waypoint\Models;

use Illuminate\Database\Eloquent\Model;

class Doc extends Model
{
    protected $table = 'docs';

    protected $fillable = [
        'doc_group_id',
        'title',
        'content',
        'slug',
        'position',
    ];

    /**
     * Get the parent DocGroup.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function docGroup()
    {
        return $this->belongsTo(DocGroup::class, 'doc_group_id');
    }
}
