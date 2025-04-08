<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class adm_access extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'adm_access';

    protected $fillable = [
        'pk_id', 
        'access_name',
        'access',
        'recordstatus',
        'lastapproveon', 
        'lastupdateon', 
        'created_by', 
        'updated_by', 

    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];
}
