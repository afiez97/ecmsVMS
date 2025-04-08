<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_prm_takwim extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_prm_takwim';

    protected $fillable = [
        'twm_id', 'twm_title', 'twm_description', 'twm_sdate', 'twm_edate', 'twm_year', 'twm_status',
        'lastupdateon', 'lastupdateby', 'lastapproveon', 'lastapproveby', 'recordstatus', 'attachment'
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
