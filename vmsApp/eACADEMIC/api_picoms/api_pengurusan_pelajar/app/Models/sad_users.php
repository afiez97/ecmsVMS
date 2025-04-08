<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class sad_users extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'sad_users';

    protected $fillable = [
        'usr_id', 
        'usr_icno',
        'usr_passwd',
        'usr_name',
        'usr_category',
        'usr_cat_eadmin',
        'usr_cat_ehrms',
        'usr_cat_ecmis',
        'usr_cat_ehep',
        'usr_cat_estudent',
        'usr_stafid',
        'usr_email',
        'usr_startdate',
        'usr_enddate',
        'usr_exppasswd',
        'usr_group1',
        'usr_group2',
        'usr_group3',
        'usr_group4',
        'usr_status',
        'user_token',
        'last_sign_in',
        'failed_attempt',
        'last_failed',
        'lastupdateon', 
        'lastupdateby', 
        'lastapproveon', 
        'lastapproveby', 
        'recordstatus',
        'recordno',
        'reccreatedon',
        'reccreatedby',
        'usr_image',
        'user_grp',
        'usr_onlinestatus',
        'reset_attempt',
        'last_reset',
        'reset_flag',
        'usr_IDexpiredDate',
        'profile',

    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        // 'password',
    ];
}
