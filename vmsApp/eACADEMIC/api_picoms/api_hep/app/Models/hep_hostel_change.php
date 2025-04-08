<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_hostel_change extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_hostel_change';
    protected $primaryKey = 'change_id';

    protected $fillable = [
        'change_id','fk_booking','fk_chkInOut','campus_id','hostel_id','block_id','room_id','bed_id','stud_name','stud_id','change_reason','change_status',
        'chgStd_remark',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus' ,'date_apply'
    ];
}
