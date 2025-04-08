<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_atd_policy extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_atd_policy';

    protected $fillable = [
        'apl_id', 
        'apl_attendance_mode',
        'apl_earlyin_dur',
        'apl_earlyout_dur',
        'apl_latein_dur',
        'apl_lateout_dur',
        'apl_refresh_interval',
        'apl_warning_status',
        'apl_warning_letter_param',
        'apl_notification',
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
