<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_living_with extends Model
{
    protected $table = 'mis_std_living_with';
    protected $fillable = [
        'sts_living_with_id', 
        'sts_living_with_name_en', 
        'sts_living_with_name_ms', 
        'recordstatus', 
    ];
}
