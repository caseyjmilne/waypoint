<?php

namespace Waypoint\Models;

use Illuminate\Database\Eloquent\Model;

class DocGroup extends Model
{
    protected $table = 'docgroup';

    protected $fillable = [
        'docset_id',
        'name',
        'description',
        'doc_ids',
    ];

    protected $casts = [
        'doc_ids' => 'array',
    ];

    /**
     * Get the parent DocSet.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function docSet()
    {
        return $this->belongsTo(DocSet::class, 'docset_id');
    }

    /**
     * Get ordered docs using FIELD() ordering based on doc_ids array.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function docs()
    {
        $ids = $this->doc_ids ?? [];

        if (empty($ids)) {
            return collect([]);
        }

        $idsString = implode(',', $ids);

        return Doc::whereIn('id', $ids)
            ->orderByRaw("FIELD(id, {$idsString})")
            ->get();
    }
}
