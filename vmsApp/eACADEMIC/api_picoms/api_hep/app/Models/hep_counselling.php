<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_counselling extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_counselling';

    protected $fillable = [
        'counselling_id','clg_id','staff_id','staff_name','staff_position', 'remark_coun', 'counseling_type_ori','counseling_type','stud_id','stud_name','stud_prog','stud_gender',
        'stud_race','coun_timeslot','counselling_date','counselling_reason','counselling_status','counselling_kaunselor','requester','alert',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus'
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
