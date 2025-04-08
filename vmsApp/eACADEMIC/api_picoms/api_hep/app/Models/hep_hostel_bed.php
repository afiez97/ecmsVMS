<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_hostel_bed extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_hostel_bed';

    protected $fillable = [
        'bed_id', 'bed_no', 'hostel_id', 'block_id', 'room_id', 'bed_occupied', 'bed_status', 'bed_remark',
        'lastupdateon', 'lastupdateby', 'lastapproveon', 'lastapproveby', 'recordstatus'
    ];
}
