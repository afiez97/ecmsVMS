<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_program extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_program';
    protected $primaryKey = 'id_program';

    protected $fillable = [
        'id_program','clg_id','prog_title','prog_org','prog_vent','prog_proposal','prog_startdate','prog_enddate','prog_cost','prog_peruntukan',
        'prog_venue','prog_advisor','prog_category_id','prog_status','prog_statusremark','prog_cert','prog_report','user_id','user_type','notify_user',
        'dateApplication','prog_participate',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus', 'prog_alloc_approve'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    // protected $hidden = [
    //     'recordstatus',
    // ];
}
