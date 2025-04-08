<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_status_parents extends Model
{
    protected $table = 'mis_status_parents';
    protected $fillable = [
        'sts_par_relation_id', 
        'sts_par_relation_name_en', 
        'sts_par_relation_name_ms', 
        'recordstatus', 
    ];
}
