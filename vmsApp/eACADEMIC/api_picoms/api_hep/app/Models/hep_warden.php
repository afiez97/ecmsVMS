<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_warden extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    protected $table = 'hep_warden';

    protected $fillable = [
        'pk_id', 'fk_campus', 'emp_warden', 'warden_status',
        'lastupdateon', 'lastupdateby', 'lastapproveon', 'lastapproveby', 'recordstatus'
    ];
}
