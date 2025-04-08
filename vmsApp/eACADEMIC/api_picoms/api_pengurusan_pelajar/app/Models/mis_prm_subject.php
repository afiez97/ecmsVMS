<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_prm_subject extends Model
{
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_prm_subject';
    protected $fillable = [
        'pk_id',
        'subject',
        'kod_subject',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
    ];
}
