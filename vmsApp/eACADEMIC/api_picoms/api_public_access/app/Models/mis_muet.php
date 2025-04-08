<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_muet extends Model
{
    protected $table = 'mis_muet';
    protected $fillable = [
        'sta_muet_id', 
        'sta_muet_name', 
        'created_at', 
        'updated_at', 
        'recordstatus', 
    ];
}
