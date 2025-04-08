<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_prm_obe_plo extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    // const UPDATED_AT = 'lastupdateon';


    protected $table = 'mis_prm_obe_plo';

    protected $fillable = [
        'obe_plo_id', 'obe_plo_name', 'pgm_id', 'obe_plo_statement', 'obe_plo_percentage','obe_plo_status',
        'lastupdateon', 'lastupdateby' , 'recordstatus','created_at','updated_at'
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
