<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_lecturer_course_detail extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_lecturer_course_detail';

    protected $fillable = [
        'pk_id', 'fk_lect_crs', 'fk_cotDet', 'fk_gsDet', 'fk_grdSkm', 'non_obe_type', 'cot_intake', 'non_obe_percentage', 'item_name',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus', 
        
        'ass_sltCi' ,'clo_lecCourse', 'weightage', 'slt'

        // ass_sltCi
        // clo_lecCourse
        // weightage
        // slt
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
