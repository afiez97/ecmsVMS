<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_asnaf extends Model
{
    protected $table = 'mis_asnaf';
    protected $fillable = [
        'asnaf_id', 
        'asnaf_name', 
        'recordstatus', 
    ];
}
