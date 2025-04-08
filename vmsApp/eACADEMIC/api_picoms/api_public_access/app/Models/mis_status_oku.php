<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_status_oku extends Model
{
    protected $table = 'mis_status_oku';
    protected $fillable = [
        'sti_status_oku_id', 
        'sti_status_oku_name', 
        'recordstatus', 
    ];
}
