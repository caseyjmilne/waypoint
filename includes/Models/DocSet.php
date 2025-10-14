<?php

namespace Waypoint\Models;

use Illuminate\Database\Eloquent\Model;

class DocSet extends Model
{
    protected $table = 'doc_sets';

    protected $fillable = [
        'name',
        'description',
        'slug',
        'icon',
    ];

    /**
     * Get doc groups for this doc set ordered by position.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function docGroups()
    {
        return $this->hasMany(DocGroup::class, 'doc_set_id')->orderBy('position');
    }
}
