<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_status extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;
    
    protected $table = 'mis_status';
    protected $fillable = [
        'sts_status_id', 
        'sts_status_name_ms', 
        'sts_status_name_en', 
        'created_at', 
        'updated_at', 
        'recordstatus', 
    ];
}
