<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class sub_mis_lecturer_course_detail extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'sub_mis_lecturer_course_detail';

    protected $fillable = [
        'pk_id', 'fk_LecCourseDet', 'fk_clo', 'marks', 'weightage', 'SLT', 
        'lastupdateon','lastupdateby','lastapproveon','lastapproveby','recordstatus' 

    ];
}
