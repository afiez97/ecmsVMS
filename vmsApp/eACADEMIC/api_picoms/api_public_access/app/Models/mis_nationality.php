<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_nationality extends Model
{
    protected $table = 'mis_nationality';
    protected $fillable = [
        'sti_nationality_id', 
        'sti_nationality_name', 
        'recordstatus', 
    ];
}
