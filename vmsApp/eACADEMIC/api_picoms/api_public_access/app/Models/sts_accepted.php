<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class sts_accepted extends Model
{

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'sts_accepted';
    protected $fillable = [
        'sts_accepted_id', 
        'sts_accepted_code', 
        'sts_accepted_en', 
        'sts_accepted_ms', 
        'sts_approved_en', 
        'sts_approved_ms', 
        'sts_supported_en', 
        'sts_supported_ms', 
        'recordstatus', 
    ];
}
