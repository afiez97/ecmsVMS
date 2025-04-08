<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_regsubject extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_std_regsubject';

    protected $fillable = [
        'rsb_id','std_studentid','pgm_id','cur_year','reg_semester','cur_intake','crs_code','rsb_status','barr_status','fk_cotDet','cMark','tMark','grade','point','mark_generate','aca_session',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus', 'rsb_type', 'ip', 'mrf',
        'old_cMark','old_tMark','old_grade', 'old_point'
        ,'warningLetter_1','warningLetter_2', 'warningLetter_3'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    // protected $hidden = [
    //     'password',
    // ];
}
