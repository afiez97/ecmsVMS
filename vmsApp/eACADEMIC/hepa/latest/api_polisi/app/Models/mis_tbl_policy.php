<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_tbl_policy extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_tbl_policy';

    protected $fillable = [
        'tpl_id', 
        'tpl_date_start',
        'tpl_date_end',
        'lastupdateon', 
        'lastupdateby', 
        'lastapproveon', 
        'lastapproveby', 
        'recordstatus',
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
