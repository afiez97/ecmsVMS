<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_chg_program extends Model
{
    // const UPDATED_AT = 'lastupdateon';
    // const CREATED_AT = 'lastapproveon';
    
    public $timestamps = false;
    
    protected $table = 'mis_std_chg_program';
    protected $fillable = [
        'std_studentid',
        'cgp_id',
        'cgp_old_pgm',
        'cgp_new_pgm',
        'app_admin',
        'app_curr_fac_dean',
        'app_new_fac_dean',
        'curr_student_fees',
        'new_student_fees',
        'recordstatus',
    ];

    // protected $hidden = [
    //     'std_studentid'
    // ];
}
