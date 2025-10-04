<?php

namespace Waypoint\Models;

use Illuminate\Database\Eloquent\Model;

class Doc extends Model
{
    protected $table = 'docs';

    protected $fillable = [
        'docgroup_id',
        'title',
        'content',
        'slug',
    ];

    /**
     * Get the parent DocGroup.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function docGroup()
    {
        return $this->belongsTo(DocGroup::class, 'docgroup_id');
    }
}
