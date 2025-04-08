<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class grade extends Model
{

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'grade';
    protected $fillable = [
        'grade_id', 
        'grade_name', 
        'lastupdateon', 
        'lastupdateby', 
        'lastapproveon', 
        'lastapproveby', 
        'recordstatus', 
    ];
}
