<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_prm_course_det extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_prm_course_det';

    protected $fillable = [
        'pk_id', 'crs_id', 'prerequisite',
        'lastupdateon', 'lastupdateby', 'lastapproveon', 'lastapproveby', 'recordstatus'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
}
