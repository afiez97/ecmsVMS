<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class aca_cal_category extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'aca_cal_category';

    protected $fillable = [
        'pk_id', 'category',
        'lastupdateon', 'lastupdateby', 'lastapproveon', 'lastapproveby', 'recordstatus'
    ];
}
