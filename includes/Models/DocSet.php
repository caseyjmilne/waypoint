<?php

namespace Waypoint\Models;

use Illuminate\Database\Eloquent\Model;

class DocSet extends Model
{
    protected $table = 'docsets';

    protected $fillable = [
        'name',
        'description',
        'doc_group_ids',
    ];

    protected $casts = [
        'doc_group_ids' => 'array',
    ];

    /**
     * Get ordered doc groups using FIELD() ordering based on doc_group_ids array.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function docGroups()
    {
        $ids = $this->doc_group_ids ?? [];

        if (empty($ids)) {
            return collect([]);
        }

        $idsString = implode(',', $ids);

        return DocGroup::whereIn('id', $ids)
            ->orderByRaw("FIELD(id, {$idsString})")
            ->get();
    }
}
