<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_cect_det extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;
/**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_std_cect_det';

    protected $fillable = [
        'fk_cect','std_course','std_course_name','std_credit_hour','std_course_pre','std_course_name_pre','std_credit_hour_pre','grade_pre',
        'cect_type',
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus'
    ];
}
