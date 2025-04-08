<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class srg_payment_via extends Model
{
    protected $table = 'srg_payment_via';
    protected $fillable = [
        'srg_payment_via_id', 
        'srg_payment_via_code', 
        'srg_payment_via_name_ms', 
        'srg_payment_via_name_en', 
        'recordstatus', 
        'created_at', 
        'updated_at', 
    ];
}
