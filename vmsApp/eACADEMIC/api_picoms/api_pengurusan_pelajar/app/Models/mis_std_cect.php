<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_cect extends Model
{
    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_std_cect';
    protected $fillable = [
        'id','studentid','std_name','pgm_id','std_edu','std_semester','std_pre_universiti','std_pre_program','std_transkrip','std_fee','cect_status','approval_coor',
        'approval_admin','catatan_coor','catatan_admin','cect_acaSession','cect_total_credit','cect_type','cect_cgpa','cect_gpa','cect_senate_decision','cect_fees',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus'
    ];
}
