<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_acaHistory extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_std_acaHistory';
    protected $fillable = [
        'std_studentid',
        'std_alumni',
        'std_muet',
        'std_eduLevel',
        'std_preUniversity',
        'std_status',
        'std_year',
        'std_cgpa',
        'std_transcript',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
    ];
}
