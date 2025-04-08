<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_registration extends Model
{
    // const UPDATED_AT = 'lastupdateon';
    // const CREATED_AT = 'lastapproveon';
    
    public $timestamps = false;
    
    protected $table = 'mis_std_registration';
    protected $fillable = [
        'std_studentid',
        'pgm_id',
        'srg_payment_via',
        'srg_payment_resit',
        'srg_payment_resitdoc',
        'srg_ic_pict',
        'srg_spm_doc',
        'srg_stpmormatrik_doc',
        'srg_dip_doc',
        'srg_deg_doc',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
    ];

    protected $hidden = [
        'password','api_token'
    ];
}
