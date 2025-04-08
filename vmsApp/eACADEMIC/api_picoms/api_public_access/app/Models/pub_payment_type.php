<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class pub_payment_type extends Model
{
    protected $table = 'pub_payment_type';
    protected $fillable = [
        'payment_type_id', 
        'payment_type_code', 
        'payment_type', 
    ];
}
