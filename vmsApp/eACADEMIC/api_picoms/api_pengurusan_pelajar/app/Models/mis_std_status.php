<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_status extends Model
{
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_std_status';
    protected $fillable = [
        'std_studentid',
        'pgm_id',
        'sts_cur_year',
        'sts_cur_intake',
        'sts_semester',
        'sts_date_joined',
        'sts_date_complete',
        'sts_status',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
    ];

    protected $hidden = [
        'password','api_token'
    ];
}
