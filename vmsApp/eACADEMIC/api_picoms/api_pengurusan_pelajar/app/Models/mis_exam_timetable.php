<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_exam_timetable extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_exam_timetable';

    protected $fillable = [
        'pk_id','fk_acaCal','fk_course','cur_year','fk_clg','pgm_id','reg_semester','fk_course','tbl_paper_type','fk_exam_type',
        'tbl_date_start','tbl_date_end','tbl_time_start','tbl_time_end','tbl_venue',
        'tbl_invigilator','tbl_status','tbl_remarks','ced_id','fk_cotDet',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus'
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
