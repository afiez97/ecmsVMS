<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_parent extends Model
{
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_std_parent';
    protected $fillable = [
        'std_studentid',
        'pgm_id',
        'par_father_title',
        'par_father_name',
        'par_father_icno',
        'par_father_address',
        'par_father_contactno',
        'par_father_relationship',
        'par_father_nationality',
        'par_mother_title',
        'par_mother_name',
        'par_mother_icno',
        'par_mother_address',
        'par_mother_contactno',
        'par_mother_relationship',
        'par_mother_nationality',
        'par_family_income',
        'par_family_responsibility',
        'par_living_with',
        'recordstatus',
    ];

    protected $hidden = [
        'password','api_token'
    ];
}
