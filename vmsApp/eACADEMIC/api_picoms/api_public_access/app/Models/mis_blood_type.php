<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_blood_type extends Model
{
    protected $table = 'mis_blood_type';
    protected $fillable = [
        'sti_blood_type_id', 
        'sti_blood_type_name', 
        'recordstatus', 
    ];
}
