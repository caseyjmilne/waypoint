<?php

namespace Waypoint\Models;

use Illuminate\Database\Eloquent\Model;

class DocGroup extends Model
{
    protected $table = 'doc_groups';

    protected $fillable = [
        'doc_set_id',
        'title',
        'slug',
        'position',
    ];

    /**
     * Get the parent DocSet.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function docSet()
    {
        return $this->belongsTo(DocSet::class, 'doc_set_id');
    }

    /**
     * Get docs for this doc group ordered by position.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function docs()
    {
        return $this->hasMany(Doc::class, 'doc_group_id')->orderBy('position');
    }
}
